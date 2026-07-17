package com.ecommerce.catalog_service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private com.ecommerce.catalog_service.ProductRepository productRepository;

    @InjectMocks
    private com.ecommerce.catalog_service.ProductService productService;

    @Test
    void getProductById_returnsProduct_whenFound() {
        com.ecommerce.catalog_service.Product product = new com.ecommerce.catalog_service.Product(1L, "Laptop", "Gaming laptop", 1299.99, 50);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        com.ecommerce.catalog_service.Product result = productService.getProductById(1L);

        assertEquals("Laptop", result.getName());
        assertEquals(1299.99, result.getPrice());
    }

    @Test
    void getProductById_throwsException_whenNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productService.getProductById(99L));

        assertTrue(ex.getMessage().contains("Product not found"));
    }

    @Test
    void createProduct_savesAndReturnsProduct() {
        com.ecommerce.catalog_service.Product product = new com.ecommerce.catalog_service.Product(null, "Mouse", "Wireless mouse", 49.99, 300);
        com.ecommerce.catalog_service.Product saved = new com.ecommerce.catalog_service.Product(1L, "Mouse", "Wireless mouse", 49.99, 300);
        when(productRepository.save(product)).thenReturn(saved);

        com.ecommerce.catalog_service.Product result = productService.createProduct(product);

        assertNotNull(result.getId());
        verify(productRepository, times(1)).save(product);
    }
}