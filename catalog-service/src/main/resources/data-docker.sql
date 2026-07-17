INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Laptop', '15 inch gaming laptop', 1299.99, 50
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop');

INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Headphones', 'Noise cancelling wireless headphones', 299.99, 120
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Headphones');

INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Keyboard', 'Mechanical RGB keyboard', 89.99, 200
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Keyboard');

INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Mouse', 'Wireless ergonomic mouse', 49.99, 300
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mouse');

INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Monitor', '27 inch 4K display', 499.99, 75
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Monitor');