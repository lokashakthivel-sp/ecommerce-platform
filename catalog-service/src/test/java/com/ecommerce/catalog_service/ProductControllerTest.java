package com.ecommerce.catalog_service;

import com.ecommerce.catalog_service.Product;
import com.ecommerce.catalog_service.ProductController;
import com.ecommerce.catalog_service.ProductService;
import com.ecommerce.catalog_service.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private ProductService productService;

    // Instantiate directly — avoids Jackson 3 vs Jackson 2 bean conflict
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void getAllProducts_returns200() throws Exception {
        when(productService.getAllProducts()).thenReturn(List.of(
                new Product(1L, "Laptop", "Gaming laptop", 1299.99, 50)
        ));

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Laptop"));
    }

    @Test
    void createProduct_returns201() throws Exception {
        Product product = new Product(null, "Mouse", "Wireless mouse", 49.99, 300);
        Product saved = new Product(1L, "Mouse", "Wireless mouse", 49.99, 300);
        when(productService.createProduct(any())).thenReturn(saved);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

//    @Test
//    void getProductById_returns404_whenNotFound() throws Exception {
//        when(productService.getProductById(99L))
//                .thenThrow(new RuntimeException("Product not found with id: 99"));
//
//        mockMvc.perform(get("/products/99"))
//                .andExpect(status().isNotFound());
//    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}