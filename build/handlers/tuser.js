"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tuser_1 = require("../models/tuser");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../lib/config"));
const token_secret = config_1.default.TOKEN_SECRET;
const store = new tuser_1.TuserStore();
const index = async (_req, res) => {
    const tusers = await store.index();
    try {
        jsonwebtoken_1.default.verify(_req.body.token, token_secret);
    }
    catch (err) {
        res.status(401);
        res.json(`Invalid token ${err}`);
        return;
    }
    try {
        var token = jsonwebtoken_1.default.sign({ tusers }, token_secret);
        res.json(token);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const show = async (req, res) => {
    const tusers = await store.show(req.body.id);
    try {
        jsonwebtoken_1.default.verify(req.body.token, token_secret);
    }
    catch (err) {
        res.status(401);
        res.json(`Invalid token ${err}`);
        return;
    }
    try {
        var token = jsonwebtoken_1.default.sign({ tusers }, token_secret);
        res.json(token);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const create = async (req, res) => {
    try {
        const tusers = {
            u_id: req.body.u_id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            u_password: req.body.u_password,
        };
        const newTuser = await store.create(tusers);
        const token = jsonwebtoken_1.default.sign({
            u_id: newTuser.u_id,
            firstName: newTuser.firstName,
            lastName: newTuser.lastName,
            u_password: newTuser.u_password,
        }, token_secret);
        res.json(token);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const destroy = async (req, res) => {
    try {
        jsonwebtoken_1.default.verify(req.body.token, token_secret);
    }
    catch (err) {
        res.status(401);
        res.json(`Invalid token ${err}`);
        return;
    }
    try {
        const deleted = await store.delete(req.body.id);
        res.json(deleted);
    }
    catch (error) {
        res.status(400);
        res.json({ error });
    }
};
const authenticate = async (req, res) => {
    try {
        const tuser = (await store.authenticate(req.body.firstName, req.body.u_password));
        const token = jsonwebtoken_1.default.sign({
            u_id: req.body.u_id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }, token_secret);
        res.json(token);
    }
    catch (error) {
        res.status(401);
        res.json({ error: 'Incorrect username or password' });
    }
};
const tuserHandlers = (app) => {
    app.get('/tusers', index);
    app.get('/tusers/:id', show);
    app.post('/tusers', create);
    app.delete('/tusers', authenticate, destroy);
    app.post('/authenticate', authenticate);
};
exports.default = tuserHandlers;
