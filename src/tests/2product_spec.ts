import { Product, ProductStore} from "../models/product";

const store = new ProductStore()

describe("Product Model", () => {
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

    it('create method should add a product', async () => {
        const result = await store.create({
            p_id: 1,
            p_name: 'Book',
            price: 35,
        });
        expect(result).toEqual({
            p_id: 1,
            p_name: 'Book',
            price: 35,
        });
        await store.create({
            p_id: 2,
            p_name: 'Pen',
            price: 5,
        });
    });

    it('index method should return a list of products', async () => {
        const result = await store.index();
        expect(result.length).toEqual(2);
    });
    
    it('show method should return the correct product', async () => {
        const result = await store.show("1");
        expect(result).toEqual({
            p_id: 1,
            p_name: 'Book',
            price: 35,
        });
    });

    it('delete method should remove the product', async () => {
        await store.delete("2");
        const result = await store.index()
        expect(result.length).toEqual(1);
    });
});
