import request from 'supertest';
import { TuserStore } from '../tuser';

describe('TuserStore', () => {
    let tusers: TuserStore;
    beforeEach(() => {
        tusers = new TuserStore();
    });

    describe('#index', () => {
        it('should return all tusers', async () => {
            const res = await request(tusers.index()).get('/tusers');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

    describe('#show', () => {
        it('should return a tuser by id', async () => {
            const res = await request(tusers.show('1')).get('/tusers/1');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });

        it('should return a 404 if tuser is not found', async () => {
            const res = await request(tusers.show('999')).get('/tusers/999');
            expect(res.status).toEqual(404);
        });
    });

    describe('#create', () => {
        it('should create a new tuser', async () => {
            const res = await request(tusers.create({
                u_id: 1,
                firstName: 'Roqia',
                lastName: 'Ahmad',
                u_password: 'password'
            })).post('/tusers');
            expect(res.status).toEqual(201);
            expect(res.body).toBeInstanceOf(Object);
        });
    });

    describe('#delete', () => {
        it('should delete a tuser by id', async () => {
            const res = await request(tusers.delete('1')).delete('/tusers/1');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });

        it('should return a 404 if tuser is not found', async () => {
            const res = await request(tusers.delete('999')).delete('/tusers/999');
            expect(res.status).toEqual(404);
        });
    });

    describe('#authenticate', () => {
        it('should authenticate a tuser', async () => {
            const res = await request(tusers.authenticate('Roqia', 'password')).post('/tusers/authenticate');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });

        it('should return a 401 if authentication fails', async () => {
            const res = await request(tusers.authenticate('Roqia', 'wrongpassword')).post('/tusers/authenticate');
            expect(res.status).toEqual(401);
        });
    });
});
