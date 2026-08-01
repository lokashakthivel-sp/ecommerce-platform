package com.ecommerce.cart_service;

import com.ecommerce.cart_service.CartItem;
import com.ecommerce.cart_service.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;

    public List<CartItem> getCart(String userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addItem(String userId, CartItem item) {
        // If item already exists, increase quantity
        return cartItemRepository.findByUserIdAndProductId(userId, item.getProductId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + item.getQuantity());
                    return cartItemRepository.save(existing);
                })
                .orElseGet(() -> {
                    item.setUserId(userId);
                    return cartItemRepository.save(item);
                });
    }

    @Transactional
    public void removeItem(String userId, Long productId) {
        cartItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void clearCart(String userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        cartItemRepository.deleteAll(items);
    }

    public Double getCartTotal(String userId) {
        return cartItemRepository.findByUserId(userId)
                .stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}