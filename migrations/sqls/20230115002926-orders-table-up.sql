/* Replace with your SQL commands */

CREATE TABLE orders (
o_id SERIAL PRIMARY KEY,
user_id INTEGER,
order_status BOOLEAN);

ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES tusers (u_id);