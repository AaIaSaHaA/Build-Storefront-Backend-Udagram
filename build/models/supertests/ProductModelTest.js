"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const product_1 = require("../product");
describe('ProductsStore', () => {
    let products;
    beforeEach(() => {
        products = new product_1.ProductStore();
    });
    describe('#index', () => {
        it('should return all products', async () => {
            const res = await (0, supertest_1.default)(products.index()).get('/products');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });
    describe('#show', () => {
        it('should return a product by id', async () => {
            const res = await (0, supertest_1.default)(products.show('1')).get('/products/1');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });
        it('should return a 404 if product is not found', async () => {
            const res = await (0, supertest_1.default)(products.show('999')).get('/products/999');
            expect(res.status).toEqual(404);
        });
    });
    describe('#create', () => {
        it('should create a new product', async () => {
            const res = await (0, supertest_1.default)(products.create({
                p_id: 1,
                p_name: 'Product 1',
                price: 9.99
            })).post('/products');
            expect(res.status).toEqual(201);
            expect(res.body).toBeInstanceOf(Object);
        });
    });
    describe('#delete', () => {
        it('should delete a product by id', async () => {
            const res = await (0, supertest_1.default)(products.delete('1')).delete('/products/1');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });
        it('should return a 404 if product is not found', async () => {
            const res = await (0, supertest_1.default)(products.delete('999')).delete('/products/999');
            expect(res.status).toEqual(404);
        });
    });
});
