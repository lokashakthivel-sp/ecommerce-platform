package com.ecommerce.order_service;

import com.ecommerce.order_service.Order;
import com.ecommerce.order_service.OrderItem;
import com.ecommerce.order_service.OrderRepository;
import com.ecommerce.order_service.OrderService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private OrderService orderService;

    @Test
    void placeOrder_savesOrder_whenProductsValid() {
        OrderItem item = new OrderItem(null, 1L, "Laptop", 1299.99, 1);
        Order order = new Order(null, "user1", null, null, null, List.of(item));

        when(restTemplate.getForObject(anyString(), eq(Object.class)))
                .thenReturn(new Object());
        when(orderRepository.save(any())).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(1L);
            return o;
        });

        Order result = orderService.placeOrder(order);

        assertEquals("CONFIRMED", result.getStatus());
        assertEquals(1299.99, result.getTotalAmount());
        assertNotNull(result.getId());
    }

    @Test
    void placeOrder_throwsException_whenProductNotFound() {
        OrderItem item = new OrderItem(null, 99L, "Ghost", 0.0, 1);
        Order order = new Order(null, "user1", null, null, null, List.of(item));

        when(restTemplate.getForObject(anyString(), eq(Object.class)))
                .thenThrow(new RuntimeException("404"));

        assertThrows(RuntimeException.class, () -> orderService.placeOrder(order));
    }

    @Test
    void getOrder_returnsOrder_whenFound() {
        Order order = new Order(1L, "user1", "CONFIRMED", 1299.99, null, List.of());
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Order result = orderService.getOrder(1L);

        assertEquals("user1", result.getUserId());
        assertEquals("CONFIRMED", result.getStatus());
    }
}