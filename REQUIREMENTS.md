# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index: 'products/' [GET]
- Show: 'products/:id' [GET]
- Create [token required]: 'products/' [POST] (token)
- [ADDED] Delete: 'products/:id  [DELETE]

#### Users
- Index [token required]: 'tusers/' [GET] (token)
- Show [token required]: 'tusers/:id' [GET] (token)
- Create N[token required]: 'tusers/' [POST] (token)
- [ADDED] Delete [token required]: 'tusers/:id' [DELETE] (token)

#### Orders
- [ADDED] Index [token required]: 'orders/' [GET] (token)
- [ADDED] Show [token required]: 'orders/:id' [GET] (token)
- [ADDED] Create N[token required]: 'orders/' [POST] (token)
- [ADDED] Delete [token required]: 'orders/:id' [DELETE] (token)
- Current Order by user (args: user id)[token required]: 'orders/current/:user_id' [GET] (token)

## Data Shapes
#### Product
- id
- name
- price

Table: products (p_id:serial[primary key], p_name:varchar(15), price:integer)

#### User
- id
- firstName
- lastName
- password

Table: tusers (u_id:serial[primary key], firstName:varchar(15), lastName:varchar(15), u_password:varchar)

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

Table: orders (o_id:serial[primary key], user_id:integer(foreign key to tusers table), order_status:Boolean)

#### m -> n relationship (order_product) [ADDED]
- order id
- product id
- quantity of each product in the order

Table: order_products (order_id:integer(foreign key to orders table), product_id:integer(foreign key to products table), order_quantity:integer)
 