import supertest from "supertest";
import app from "../server.js";
import { Tuser, TuserStore } from "../models/tuser";
import { Product } from "../models/product";
import { Order } from "../models/order";
import jwt_decode from "jwt-decode"
import jwt, {Secret} from "jsonwebtoken"
import config from "../lib/config";

const secret = config.TOKEN_SECRET;

const request = supertest(app)
const uStore = new TuserStore()
const user: Tuser = {
    firstname: 'Ahmad',
    lastname: 'Hassan',
    u_password: 'longpassword'
}
const newUser: Tuser = {
    firstname: 'ahmad',
    lastname: 'hassan',
    u_password: 'long'
}

const createdUser: Tuser = {...newUser, u_id:2};

let product: Product = {
    p_name: 'laptop',
    price: 4000
}

let order: Order = {
    user_id: 1,
    order_status: true
}

type DecodedJWT = {
    user: Tuser;
}

const jsonHeaders = {
    "Accept": 'application/json',
    'content-type': 'application/json'
}

let token: string;

describe('routes test', () => {
    beforeAll(async() => {
        await uStore.create(user);
    });
    describe('main route tests', () => {
        it('gets the main endpoint',async () => {
            const response = await request.get('/');
            expect(response.status).toBe(200);
            expect(response.text).toContain('API Endpoints')
        });
    });
    describe('authenticate route tests', () => {
        it('user should authenticate successfully when given a correct username(firstname), password', async() => {
            const response = await request
                .post('/authenticate')
                .set(jsonHeaders)
                .send({firstname: newUser.firstname, lastname: newUser.lastname, u_password: newUser.u_password});
            expect(response.status).toBe(200);
            console.log(response.body)
            token = 'Bearer' + response.body;
            const decodedUser: Tuser = (jwt.verify(response.body, secret) as DecodedJWT).user;
            expect(decodedUser.firstname).toEqual(user.firstname);
            expect(decodedUser.lastname).toEqual(user.lastname);
            expect(decodedUser.u_id).toEqual(user.u_id);
            expect(decodedUser.u_password).toBeUndefined();
        });
    });
    describe('Access denied tests', () => {
        it('user should revive 401 trying to get user orders with no token', async() => {
            const response = await request.get('/tusers/1/orders');
            expect(response.status).toBe(401);
        });
        it('user should revive 401 trying to create order with no token', async() => {
            const response = await request.post('/order');
            expect(response.status).toBe(401);
        });
        it('user should revive 401 trying to add product to an order with no token', async() => {
            const response = await request.post('/tusers/1/orders');
            expect(response.status).toBe(401);
        });
    });
    describe('Creation routes test', () => {
        it('user can create a user', async() => {
            const response = await request
                .post('/tusers')
                .set({...jsonHeaders, Authorization: token})
                .send(newUser);
            expect(response.status).toBe(200);
            const decodedUser: Tuser = (jwt_decode(response.body) as DecodedJWT).user;
            expect(decodedUser.firstname).toEqual(createdUser.firstname)
            expect(decodedUser.lastname).toEqual(createdUser.lastname);
            expect(decodedUser.u_id).toEqual(createdUser.u_id);
            expect(decodedUser.u_password).toBeUndefined();
        });
        it ('user can create a product', async() => {
            const response = await request
                .post('/products')
                .set({...jsonHeaders, Authorization: token})
                .send(product);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({...product, p_id: 1});
            product = {...product, p_id: 1}
        });
        it ('user can create an order', async() => {
            const response = await request
                .post('/orders')
                .set({...jsonHeaders, Authorization: token})
                .send(order);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({...order, id: 1});
            order = {...order, o_id: 1}
        });
    });
    describe('User routes test', () => {
        it('user get order of a user', async() => {
            const response = await request
                .get('/tusers/1/orders')
                .set({...jsonHeaders, Authorization: token});
            expect(response.status).toBe(200)
            expect(response.body.length).toBe(1)
            expect(response.body[0].o_id).toEqual(order.o_id)
            expect(response.body[0].order_status).toEqual(order.order_status)
            expect(response.body[0].user_id).toEqual(order.user_id)
        });
    });
    describe('Product routes test', () => {
        it('user can get all products', async() => {
            const response = await request
                .get('/products')
                .set({...jsonHeaders, Authorization: token});
            expect(response.status).toBe(200)
            expect(response.body.length).toBe(2)
            expect(response.body[1].p_id).toEqual(product.p_id)
            expect(response.body[1].p_name).toEqual(product.p_name)
            expect(response.body[1].price).toEqual(product.price)
        });
        it('user can get specific products', async() => {
            const response = await request
                .get('/products/2')
                .set({...jsonHeaders, Authorization: token});
            expect(response.status).toBe(200)
            expect(response.body.p_id).toEqual(product.p_id)
            expect(response.body.p_name).toEqual(product.p_name)
            expect(response.body.price).toEqual(product.price)
        });
    });
    describe('Order routes test', () => {
        it('user can add product to an order', async() => {
            const response = await request
                .post('/tusers/1/orders')
                .set({...jsonHeaders, Authorization: token})
                .send(product);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(product);
        });
    });
    describe('Deletion routes test', () => {
        it ('user can delete an order',async() => {
            const response = await request
                .delete('/orders')
                .set({...jsonHeaders, Authorization: token})
                .send({id: order.o_id})
                expect(response.status).toBe(200);
                expect(response.body).toEqual(order)
        });
        it ('user can delete an product',async() => {
            const response = await request
                .delete('/products')
                .set({...jsonHeaders, Authorization: token})
                .send({id: product.p_id})
                expect(response.status).toBe(200);
                expect(response.body).toEqual(product)
        });
        it ('superuser can delete an user',async() => {
            const response = await request
                .delete('/tusers')
                .set({...jsonHeaders, Authorization: token})
                .send({id: newUser.u_id})
                expect(response.status).toBe(200);
                expect(response.body).toEqual(newUser)
        });
    })
});