/* Replace with your SQL commands */

CREATE TABLE order_products (
order_id INTEGER,
product_id INTEGER,
order_quantity INTEGER);

ALTER TABLE order_products ADD FOREIGN KEY (order_id) REFERENCES orders (o_id);
ALTER TABLE order_products ADD FOREIGN KEY (product_id) REFERENCES products (p_id);