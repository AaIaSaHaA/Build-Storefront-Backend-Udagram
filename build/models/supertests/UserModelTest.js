"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const tuser_1 = require("../tuser");
describe('TuserStore', () => {
    let tusers;
    beforeEach(() => {
        tusers = new tuser_1.TuserStore();
    });
    describe('#index', () => {
        it('should return all tusers', async () => {
            const res = await (0, supertest_1.default)(tusers.index()).get('/tusers');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });
    describe('#show', () => {
        it('should return a tuser by id', async () => {
            const res = await (0, supertest_1.default)(tusers.show('1')).get('/tusers/1');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });
        it('should return a 404 if tuser is not found', async () => {
            const res = await (0, supertest_1.default)(tusers.show('999')).get('/tusers/999');
            expect(res.status).toEqual(404);
        });
    });
    describe('#create', () => {
        it('should create a new tuser', async () => {
            const res = await (0, supertest_1.default)(tusers.create({
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
            const res = await (0, supertest_1.default)(tusers.delete('1')).delete('/tusers/1');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });
        it('should return a 404 if tuser is not found', async () => {
            const res = await (0, supertest_1.default)(tusers.delete('999')).delete('/tusers/999');
            expect(res.status).toEqual(404);
        });
    });
    describe('#authenticate', () => {
        it('should authenticate a tuser', async () => {
            const res = await (0, supertest_1.default)(tusers.authenticate('Roqia', 'password')).post('/tusers/authenticate');
            expect(res.status).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });
        it('should return a 401 if authentication fails', async () => {
            const res = await (0, supertest_1.default)(tusers.authenticate('Roqia', 'wrongpassword')).post('/tusers/authenticate');
            expect(res.status).toEqual(401);
        });
    });
});
