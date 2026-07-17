package com.ecommerce.catalog_service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<com.ecommerce.catalog_service.Product, Long> {
    List<com.ecommerce.catalog_service.Product> findByNameContainingIgnoreCase(String name);
}