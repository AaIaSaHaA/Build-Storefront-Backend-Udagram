import request from 'supertest';
import { OrderStore } from '../order';

describe('Orders', () => {
    let orders: OrderStore;
    beforeEach(() => {
        orders = new OrderStore();
    });

    describe('#index', () => {
        it('should return all orders', async () => {
            const res = await request(orders.index()).get('/orders');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

    describe('#show', () => {
        it('should return an order by id', async () => {
            const res = await request(orders.show('1')).get('/orders/1');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });

        it('should return a 404 if order is not found', async () => {
            const res = await request(orders.show('999')).get('/orders/999');
            expect(res.status).toEqual(404);
        });
    });

    describe('#create', () => {
        it('should create a new order', async () => {
            const res = await request(orders.create({
                o_id: 1,
                user_id: 1,
                order_status: true
            })).post('/orders');
            expect(res.status).toEqual(201);
            expect(res.body).toBeInstanceOf(Object);
        });
    });

    describe('#delete', () => {
        it('should delete an order by id', async () => {
            const res = await request(orders.delete('1')).delete('/orders/1');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });

        it('should return a 404 if order is not found', async () => {
            const res = await request(orders.delete('999')).delete('/orders/999');
            expect(res.status).toEqual(404);
        });
    });
});
