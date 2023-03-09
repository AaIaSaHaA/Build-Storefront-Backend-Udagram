"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_js_1 = __importDefault(require("./server.js"));
const tuser_1 = require("./models/tuser");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const request = (0, supertest_1.default)(server_js_1.default);
const uStore = new tuser_1.TuserStore();
const user = {
    u_id: 1,
    firstName: 'Ahmad',
    lastName: 'Hassan',
    u_password: 'longpassword'
};
const newUser = {
    u_id: 2,
    firstName: 'ahmad',
    lastName: 'hassan',
    u_password: 'long'
};
const createdUser = { ...newUser, u_id: 2 };
let product = {
    p_id: 1,
    p_name: 'laptop',
    price: 4000
};
let order = {
    o_id: 1,
    user_id: 1,
    order_status: true
};
const jsonHeaders = {
    Accept: 'application/json',
    'content-type': 'application/json'
};
let token;
describe('routes test', () => {
    beforeAll(async () => {
        await uStore.create(user);
    });
    describe('mait route tests', () => {
        it('gets the main endpoint', async () => {
            const response = await request.get('/');
            expect(response.status).toBe(200);
            expect(response.text).toContain('API Endpoints');
        });
    });
    describe('authenticate route tests', () => {
        it('user should authenticate successfully when given a correct username(firstname), password', async () => {
            const response = await request
                .post('/authenticate')
                .set(jsonHeaders)
                .send((({ firstName, u_password }) => ({ firstName, u_password }))(user));
            expect(response.status).toBe(200);
            token = 'Bearer' + response.body;
            const decodedUser = (0, jwt_decode_1.default)(response.body).user;
            expect(decodedUser.firstName).toEqual(user.firstName);
            expect(decodedUser.lastName).toEqual(user.lastName);
            expect(decodedUser.u_id).toEqual(user.u_id);
            expect(decodedUser.u_password).toBeUndefined();
        });
    });
    describe('Access denied tests', () => {
        it('user should revive 401 trying to create user with no token', async () => {
            const response = await request.post('/tusers');
            expect(response.status).toBe(401);
        });
        it('user should revive 401 trying to get user orders with no token', async () => {
            const response = await request.get('/tusers/1/orders');
            expect(response.status).toBe(401);
        });
        it('user should revive 401 trying to create product with no token', async () => {
            const response = await request.post('/product');
            expect(response.status).toBe(401);
        });
        it('user should revive 401 trying to create order with no token', async () => {
            const response = await request.post('/order');
            expect(response.status).toBe(401);
        });
        it('user should revive 401 trying to edit order with no token', async () => {
            const response = await request.patch('/order');
            expect(response.status).toBe(401);
        });
        it('user should revive 401 trying to add product to an order with no token', async () => {
            const response = await request.post('/tusers');
            expect(response.status).toBe(401);
        });
    });
    describe('Creation routes test', () => {
        it('user can create a user', async () => {
            const response = await request
                .post('/tusers')
                .set({ ...jsonHeaders, Authorization: token })
                .send(newUser);
            expect(response.status).toBe(200);
            const decodedUser = (0, jwt_decode_1.default)(response.body).user;
            expect(decodedUser.firstName).toEqual(createdUser.firstName);
            expect(decodedUser.lastName).toEqual(createdUser.lastName);
            expect(decodedUser.u_id).toEqual(createdUser.u_id);
            expect(decodedUser.u_password).toBeUndefined();
        });
        it('user can create a product', async () => {
            const response = await request
                .post('/products')
                .set({ ...jsonHeaders, Authorization: token })
                .send(product);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ ...product, id: 1 });
            product = { ...product, p_id: 1 };
        });
        it('user can create an order', async () => {
            const response = await request
                .post('/orders')
                .set({ ...jsonHeaders, Authorization: token })
                .send(order);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ ...order, id: 1 });
            order = { ...order, o_id: 1 };
        });
    });
    describe('User routes test', () => {
        it('user get order of a user', async () => {
            const response = await request
                .get('/tusers/1/orders')
                .set({ ...jsonHeaders, Authorization: token });
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].o_id).toEqual(order.o_id);
            expect(response.body[0].order_status).toEqual(order.order_status);
            expect(response.body[0].user_id).toEqual(order.user_id);
        });
    });
    describe('Product routes test', () => {
        it('user can get all products', async () => {
            const response = await request
                .get('/products')
                .set({ ...jsonHeaders, Authorization: token });
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].p_id).toEqual(product.p_id);
            expect(response.body[0].p_name).toEqual(product.p_name);
            expect(response.body[0].price).toEqual(product.price);
        });
        it('user can get specific products', async () => {
            const response = await request
                .get('/products/1')
                .set({ ...jsonHeaders, Authorization: token });
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body.p_id).toEqual(product.p_id);
            expect(response.body.p_name).toEqual(product.p_name);
            expect(response.body.price).toEqual(product.price);
        });
    });
    describe('Order routes test', () => {
        it('user can add a product to an order', async () => {
            const response = await request
                .post(`/orders/${order.o_id}`)
                .set({ ...jsonHeaders, Authorization: token })
                .send({ product_id: product.p_id, order_quantity: 20 });
            expect(response.status).toBe(200);
            expect(response.body.id).toEqual(1);
            expect(response.body.order_id).toEqual(order.o_id);
            expect(response.body.product_id).toEqual(product.p_id);
            expect(response.body.order_quantity).toEqual(20);
        });
        it('user can edit an order status', async () => {
            const response = await request
                .patch(`/orders/${order.o_id}`)
                .set({ ...jsonHeaders, Authorization: token })
                .send({ order_status: true });
            expect(response.status).toBe(200);
            expect(response.body.o_id).toEqual(order.o_id);
            expect(response.body.u_id).toEqual(order.user_id);
            expect(response.body.order_status).toEqual(true);
        });
        it('user can not add product to completed order', async () => {
            const response = await request
                .post(`/orders/${order.o_id}`)
                .set({ ...jsonHeaders, Authorization: token })
                .send({ product_id: product.p_id, order_quantity: 20 });
            expect(response.status).toBe(400);
        });
    });
});
