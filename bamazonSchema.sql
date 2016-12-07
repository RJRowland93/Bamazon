CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) DEFAULT "General",
price DECIMAL(10,2) NOT NULL,
stock_quantity INT(10) DEFAULT 0,
PRIMARY KEY (item_id)
);

CREATE TABLE departments (
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR (100) DEFAULT "General",
over_head_costs DECIMAL(10,2) DEFAULT 0,
total_sales DECIMAL(10,2) DEFAULT 0,
PRIMARY KEY (department_id)
);