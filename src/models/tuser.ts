import client from "../database";
import bcrypt from 'bcrypt'
import config from "../lib/config";

const pepper = config.BCRYPT_PASSWORD;
const saltRounds = config.SALT_ROUNDS;

export type Tuser = {
    u_id?: number;
    firstname: string;
    lastname: string;
    u_password: string;
}

export class TuserStore {
    async index(): Promise<Tuser[]> { //Read from Database
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM tusers'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }
        catch(err) {
            throw new Error(`Can not connect to tusers ${err}`)
        }
    }
  
    async show(id: string): Promise<Tuser> { //Read under a condition
        try {
            const sql = 'SELECT * FROM tusers WHERE u_id=($1)'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        }
        catch (err) {
            throw new Error(`Could not find this tuser ${id}. Error: ${err}`)
        }
    }
  
    async create(s: Tuser): Promise<Tuser> { //Create new row in the Database
        try {
            const sql = 'INSERT INTO tusers (firstname, lastname, u_password) VALUES($1, $2, $3) RETURNING *'
            const conn = await client.connect()
            const hash = bcrypt.hashSync(
                s.u_password + pepper,
                parseInt(saltRounds as string) 
            );            
            const result = await conn.query(sql, [s.firstname, s.lastname, hash])
            const user = result.rows[0]
            conn.release()
            return user
        }
        catch (err) {
            throw new Error(`Could not add new tuser ${s.firstname}. Error: ${err}`)
        }
    }

    async delete(id: string): Promise<Tuser> { //Delete a row from the Database
        try {
            const sql = 'DELETE FROM tusers WHERE u_id=($1)'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            const tuser = result.rows[0]
            conn.release()
            return tuser
        }
        catch (err) {
            throw new Error(`Could not delete tuser ${id}. Error: ${err}`)
        }
    }

    async authenticate(username: string, password: string): Promise<Tuser | null> {
        const conn = await client.connect()
        const sql = `SELECT u_password FROM tusers WHERE firstname = $1`;
        const result = await conn.query(sql, [username])

        // const hashedPassword = bcrypt.hashSync(password, saltRounds);
        // const hashedPasswordWithPepper = bcrypt.hashSync(hashedPassword + pepper, saltRounds);
        // console.log(hashedPasswordWithPepper)

        if (result.rows.length) {
            const user = result.rows[0]
            console.log(user)

            if (bcrypt.compareSync(password+pepper, user.u_password)) {
                return user
            }
        }
        return null
    }
}