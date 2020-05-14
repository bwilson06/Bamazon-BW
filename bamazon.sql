CREATE DATABASE bamazon_db;
USE DATABASE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,4) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY(item_id)
)

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES (
    "adidas women's running shoes",
    "footwear",
    59.99,
    5
),
(
    "succulent plants",
    "plants",
    10.35,
    8
),
(
    "men's jeans",
    "clothing",
    19.99,
    5
),
(
    "nike hat",
    "clothing",
    14.95,
    20
),
(
    "reading lamp",
    "home decor",
    20.95,
    3
),
