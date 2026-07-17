package com.ecommerce.order_service;

import com.ecommerce.order_service.OrderItem;
import com.ecommerce.order_service.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    @Value("${catalog.service.url}")
    private String catalogServiceUrl;

    public Order placeOrder(Order order) {
        // Validate each product exists in catalog-service
        for (OrderItem item : order.getItems()) {
            try {
                restTemplate.getForObject(
                        catalogServiceUrl + "/products/" + item.getProductId(),
                        Object.class
                );
            } catch (Exception e) {
                throw new RuntimeException("Product not found: " + item.getProductId());
            }
        }

        // Calculate total
        double total = order.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotalAmount(total);
        order.setStatus("CONFIRMED");

        return orderRepository.save(order);
    }

    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }

    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order updateStatus(Long orderId, String status) {
        Order order = getOrder(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}