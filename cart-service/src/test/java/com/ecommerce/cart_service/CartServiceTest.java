package com.ecommerce.cart_service;

import com.ecommerce.cart_service.CartItem;
import com.ecommerce.cart_service.CartItemRepository;
import com.ecommerce.cart_service.CartService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void getCart_returnsItemsForUser() {
        List<CartItem> items = List.of(
                new CartItem(1L, "user1", 101L, "Laptop", 1299.99, 1)
        );
        when(cartItemRepository.findByUserId("user1")).thenReturn(items);

        List<CartItem> result = cartService.getCart("user1");

        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
    }

    @Test
    void addItem_savesNewItem_whenNotInCart() {
        CartItem item = new CartItem(null, null, 101L, "Laptop", 1299.99, 1);
        CartItem saved = new CartItem(1L, "user1", 101L, "Laptop", 1299.99, 1);

        when(cartItemRepository.findByUserIdAndProductId("user1", 101L))
                .thenReturn(Optional.empty());
        when(cartItemRepository.save(any())).thenReturn(saved);

        CartItem result = cartService.addItem("user1", item);

        assertEquals("user1", result.getUserId());
        verify(cartItemRepository, times(1)).save(any());
    }

    @Test
    void addItem_increasesQuantity_whenItemAlreadyInCart() {
        CartItem existing = new CartItem(1L, "user1", 101L, "Laptop", 1299.99, 1);
        CartItem incoming = new CartItem(null, null, 101L, "Laptop", 1299.99, 2);

        when(cartItemRepository.findByUserIdAndProductId("user1", 101L))
                .thenReturn(Optional.of(existing));
        when(cartItemRepository.save(any())).thenReturn(existing);

        cartService.addItem("user1", incoming);

        assertEquals(3, existing.getQuantity());
    }

    @Test
    void getCartTotal_calculatesCorrectly() {
        List<CartItem> items = List.of(
                new CartItem(1L, "user1", 101L, "Laptop", 1299.99, 2),
                new CartItem(2L, "user1", 102L, "Mouse", 49.99, 3)
        );
        when(cartItemRepository.findByUserId("user1")).thenReturn(items);

        Double total = cartService.getCartTotal("user1");

        assertEquals(1299.99 * 2 + 49.99 * 3, total, 0.01);
    }
}