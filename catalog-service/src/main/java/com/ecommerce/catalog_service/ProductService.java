package com.ecommerce.catalog_service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final com.ecommerce.catalog_service.ProductRepository productRepository;

    public List<com.ecommerce.catalog_service.Product> getAllProducts() {
        return productRepository.findAll();
    }

    public com.ecommerce.catalog_service.Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public com.ecommerce.catalog_service.Product createProduct(com.ecommerce.catalog_service.Product product) {
        return productRepository.save(product);
    }

    public List<com.ecommerce.catalog_service.Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public com.ecommerce.catalog_service.Product updateProduct(Long id, com.ecommerce.catalog_service.Product updated) {
        com.ecommerce.catalog_service.Product existing = getProductById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}