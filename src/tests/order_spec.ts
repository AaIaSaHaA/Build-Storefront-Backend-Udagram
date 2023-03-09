import { Order, OrderStore} from "../models/order";

const store = new OrderStore()

describe("Order Model", () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('should have a getCurrentOrderByUserId method', () => {
        expect(store.getCurrentOrderByUserId).toBeDefined();
    });

    it('index method should return a list of orders', async () => {
        const result = await store.index();
        expect(result).toEqual([{
            o_id: 1,
            user_id: 5,
            order_status: true,
        }]);
    });
    
    it('show method should return the correct order', async () => {
        const result = await store.show("1");
        expect(result).toEqual({
            o_id: 1,
            user_id: 5,
            order_status: true,
        });
    });

    it('create method should add an order', async () => {
        const result = await store.create({
            o_id: 1,
            user_id: 5,
            order_status: true,
        });
        expect(result).toEqual({
            o_id: 1,
            user_id: 5,
            order_status: true,
        });
    });

    it('delete method should remove the order', async () => {
        store.delete("1");
        const result = await store.index()
        expect(result).toEqual([]);
    });
});
