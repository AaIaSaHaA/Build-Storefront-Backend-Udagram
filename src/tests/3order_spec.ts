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

    it('create method should add an order', async () => {
        const result = await store.create({
            o_id: 1,
            user_id: 1,
            order_status: true,
        });
        expect(result).toEqual({
            o_id: 1,
            user_id: 1,
            order_status: true,
        });
    });

    it('index method should return a list of orders', async () => {
        const result = await store.index();
        expect(result).toEqual([{
            o_id: 1,
            user_id: 1,
            order_status: true,
        }]);
    });
    
    it('show method should return the correct order', async () => {
        const result = await store.show("1");
        expect(result).toEqual({
            o_id: 1,
            user_id: 1,
            order_status: true,
        });
    });

    it('delete method should remove the order', async () => {
        await store.delete("2");
        const result = await store.index()
        expect(result.length).toEqual(1);
    });

    it('get current order by userId',async () => {
        const result = await store.getCurrentOrderByUserId(1)
        //console.log(result)
        expect(result).toEqual({ o_id: 1, user_id: 1, order_status: true })
    });

    it('add product to order', async () => {
        const result = await store.addProduct(1,1,10)
        //console.log(result)
        expect(result).toEqual({order_id: 1, product_id: 1, order_quantity: 10})
    });
});
