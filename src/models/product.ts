import client from "../database";

export type Product = {
    p_id: number;
    p_name: string;
    price: number;
}

export class ProductStore {
    async index(): Promise<Product[]> { //Read from Database
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM products'
            const result = await conn.query(sql)
            conn.release()
            return result.rows;
        }
        catch(err) {
            throw new Error(`Can not connect to products ${err}`)
        }
    }
  
    async show(id: string): Promise<Product> { //Read under a condition
        try {
            const sql = 'SELECT * FROM products WHERE p_id=($1)'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        }
        catch (err) {
            throw new Error(`Could not find this product ${id}. Error: ${err}`)
        }
    }
  
    async create(s: Product): Promise<Product> { //Create new row in the Database
        try {
            const sql = 'INSERT INTO products (p_name, price) VALUES($1, $2) RETURNING *'
            const conn = await client.connect()
            const result = await conn.query(sql, [s.p_name, s.price])
            const product = result.rows[0]
            conn.release()
            return product
        }
        catch (err) {
            throw new Error(`Could not add new product ${name}. Error: ${err}`)
        }
    }

    async delete(id: string): Promise<Product> { //Delete a row from the Database
        try {
            const sql = 'DELETE FROM products WHERE p_id=($1)'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            const product = result.rows[0]
            conn.release()
            return product
        }
        catch (err) {
            throw new Error(`Could not delete product ${id}. Error: ${err}`)
        }
    }
}