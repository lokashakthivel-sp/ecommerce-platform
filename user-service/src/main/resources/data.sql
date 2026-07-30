MERGE INTO users (id, email, password, first_name, last_name, role, created_at)
KEY (email)
VALUES (
    'admin-uuid-001',
    'admin@ecommerce.com',
    '$2a$10$va6ZwOvcG7rZ6WUDwjYosOG9HfUuhQCnZsPJFd9DxbwCI2KEgB81i',
    'Admin',
    'User',
    'ADMIN',
    CURRENT_TIMESTAMP
);
--password: admin123