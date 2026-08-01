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

    @Value("${cart.service.url}")
    private String cartServiceUrl;

    public Order placeOrder(Order order) {
        for (OrderItem item : order.getItems()) {
            item.setId(null);
            try {
                restTemplate.getForObject(
                        catalogServiceUrl + "/products/" + item.getProductId(),
                        Object.class
                );
            } catch (Exception e) {
                throw new RuntimeException("Product not found: " + item.getProductId());
            }
        }

        double total = order.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotalAmount(total);
        order.setStatus("CONFIRMED");

        Order saved = orderRepository.save(order);

        // Clear cart after successful order
        try {
            restTemplate.delete(cartServiceUrl + "/cart/" + order.getUserId());
        } catch (Exception e) {
            // Log but don't fail the order if cart clear fails
            System.out.println("Warning: Could not clear cart for user " + order.getUserId());
        }

        return saved;
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