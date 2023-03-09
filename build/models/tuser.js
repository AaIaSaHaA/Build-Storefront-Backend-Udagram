"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../lib/config"));
const pepper = config_1.default.BCRYPT_PASSWORD;
const saltRounds = config_1.default.SALT_ROUNDS;
class TuserStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM tusers';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Can not connect to tusers ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM tusers WHERE u_id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find this tuser ${id}. Error: ${err}`);
        }
    }
    async create(s) {
        try {
            const sql = 'INSERT INTO tusers (firstName, lastName, u_password) VALUES($1, $2, $3) RETURNING *';
            const conn = await database_1.default.connect();
            const hash = bcrypt_1.default.hashSync(s.u_password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [s.firstName, s.lastName, hash]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not add new tuser ${name}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM tusers WHERE u_id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const tuser = result.rows[0];
            conn.release();
            return tuser;
        }
        catch (err) {
            throw new Error(`Could not delete tuser ${id}. Error: ${err}`);
        }
    }
    async authenticate(username, password) {
        const conn = await database_1.default.connect();
        const sql = `SELECT u_password FROM tusers WHERE firstName=${username}`;
        const result = await conn.query(sql, [username]);
        console.log(password + pepper);
        if (result.rows.length) {
            const user = result.rows[0];
            console.log(user);
            if (bcrypt_1.default.compareSync(password + pepper, user.password_digest)) {
                return user;
            }
        }
        return null;
    }
}
exports.TuserStore = TuserStore;
