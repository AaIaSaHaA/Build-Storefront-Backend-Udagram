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

    it('create method should add a user', async () => {
        const result = await store.create({
            u_id: 1,
            firstname: 'Fatima',
            lastname: 'Julmood',
            u_password: 'fatima@1234',
        });
        //console.log(result)
        expect(result.firstname).toEqual('Fatima')
        expect(result.lastname).toEqual('Julmood')        

        await store.create({
            u_id: 2,
            firstname: 'Aisha',
            lastname: 'Ahmad',
            u_password: 'Aisha@1234',
        });
    });

    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result[0].firstname).toEqual('Fatima')
        expect(result[0].lastname).toEqual('Julmood')
        expect(result.length).toEqual(2)
    });
    
    it('show method should return the correct book', async () => {
        const result = await store.show("1");
        expect(result.firstname).toEqual('Fatima')
        expect(result.lastname).toEqual('Julmood')
    });

    it('delete method should remove the book', async () => {
        store.delete("2");
        const result = await store.index()
        expect(result.length).toEqual(1);
    });
});
