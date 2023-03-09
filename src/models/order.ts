import client from "../database";

export type Order = {
    o_id: number;
    user_id: number;
    order_status: boolean;
}

export type OrderProduct = {
    order_id: number;
    product_id: number;
    order_quantity: number;
}

export class OrderStore {
    async index(): Promise<Order[]> { //Read from Database
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM orders'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }
        catch(err) {
            throw new Error(`Can not connect to orders ${err}`)
        }
    }
  
    async show(id: string): Promise<Order> { //Read under a condition
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        }
        catch (err) {
            throw new Error(`Could not find this order ${id}. Error: ${err}`)
        }
    }
  
    async create(s: Order): Promise<Order> { //Create new row in the Database
        try {
            const sql = 'INSERT INTO orders (user_id, order_status) VALUES($1, $2) RETURNING *'
            const conn = await client.connect()          
            const result = await conn
                .query(sql, [s.user_id, s.order_status])
            const book = result.rows[0]
            conn.release()
            return book
        }
        catch (err) {
            throw new Error(`Could not add new order ${s.o_id}. Error: ${err}`)
        }
    }
  
    async delete(id: string): Promise<Order> { //Delete a row from the Database
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            const order = result.rows[0]
            conn.release()
            return order
        }
        catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`)
        }
    }

    async getCurrentOrderByUserId(id: number): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = `SELECT * FROM orders WHERE user_id = ${id}`;
            const result = await conn.query(sql,[id]);
            conn.release();

            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not get current order ${id}. ${err}`);
        }
    }

    async addProduct (
        order_quantity: number,
        order_id: number,
        product_id: number,
    ): Promise<OrderProduct> {
        try {
            const osql = 'DELETE FROM orders WHERE id=($1)'
            const conn = await client.connect()
            const result = await conn.query(osql, [order_id])
            const order = result.rows[0]
            
            if (order.order_status !== true) {
                throw new Error (
                    `Could not add product ${product_id} to order ${order_id} because order status is ${order.order_status}`
                )
            }
            conn.release();
        }
        catch (err) {
            throw new Error(`${err}`)
        }

        try {
            const sql = 'INSERT INTO OrderProduct (order_id, product_id, order_quantity) VALUES($1, $2, $3) RETURNING *'
            const conn = await client.connect()
            const result = await conn.query(sql, [])
            const orderproduct: OrderProduct = result.rows[0]
            conn.release()
            return orderproduct
        }
        catch (err) {
            throw new Error(`Could not add product ${product_id} to order ${order_id}. Error: ${err}`)
        }
    };
}