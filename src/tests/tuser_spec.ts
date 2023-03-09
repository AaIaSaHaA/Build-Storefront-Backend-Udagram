import { Tuser, TuserStore} from "../models/tuser";

const store = new TuserStore()

describe("Tuser Model", () => {
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

    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result).toEqual([{
            u_id: 1,
            firstName: 'Fatima',
            lastName: 'Julmood',
            u_password: 'fatima@1234',
        }]);
    });
    
    it('show method should return the correct book', async () => {
        const result = await store.show("1");
        expect(result).toEqual({
            u_id: 1,
            firstName: 'Fatima',
            lastName: 'Julmood',
            u_password: 'fatima@1234',
        });
    });

    it('create method should add a user', async () => {
        const result = await store.create({
            u_id: 1,
            firstName: 'Fatima',
            lastName: 'Julmood',
            u_password: 'fatima@1234',
        });
        expect(result).toEqual({
            u_id: 1,
            firstName: 'Fatima',
            lastName: 'Julmood',
            u_password: 'fatima@1234',
        });
    });

    it('delete method should remove the book', async () => {
        store.delete("1");
        const result = await store.index()
        expect(result).toEqual([]);
    });
});
