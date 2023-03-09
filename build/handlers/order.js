"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const config_1 = __importDefault(require("../lib/config"));
const token_secret = config_1.default.TOKEN_SECRET;
const store = new order_1.OrderStore();
const index = async (_req, res) => {
    const orders = await store.index();
    res.json(orders);
};
const show = async (req, res) => {
    const orders = await store.show(req.body.id);
    res.json(orders);
};
const create = async (req, res) => {
    const orders = {
        o_id: req.body.o_id,
        user_id: req.body.user_id,
        order_status: req.body.order_status,
    };
    try {
        jsonwebtoken_1.default.verify(req.body.token, token_secret);
    }
    catch (err) {
        res.status(401);
        res.json(`Invalid token ${err}`);
        return;
    }
    try {
        const newOrder = await store.create(orders);
        var token = jsonwebtoken_1.default.sign({ orders: newOrder }, token_secret);
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
const getCOBUId = async (req, res) => {
    try {
        jsonwebtoken_1.default.verify(req.body.token, token_secret);
    }
    catch (err) {
        res.status(401);
        res.json(`Invalid token ${err}`);
        return;
    }
    try {
        const currentOrder = await store.getCurrentOrderByUserId(req.body.id);
        res.json(currentOrder);
        return res.json(currentOrder);
    }
    catch (error) {
        res.status(400);
        res.json({ error });
    }
};
const getUO = async (req, res) => {
    try {
        const o_id = parseInt(req.params.id);
        const p_id = parseInt(req.body.product.id);
        const order_quantity = parseInt(req.body.order_quantity);
        const addProduct = await store.addProduct(order_quantity, o_id, p_id);
        res.json(addProduct);
    }
    catch (err) {
        res.status(400);
        res.json({ err });
    }
};
const orderHandlers = (app) => {
    app.get('/orders', index);
    app.get('/orders/:id', show);
    app.post('/orders', authentication_1.default, create);
    app.delete('/orders', destroy);
    app.get('//tusers/:id/orders', authentication_1.default, getCOBUId);
    app.post('/tusers/:id/orders', authentication_1.default, getUO);
    app.post('/authenticate', authentication_1.default);
};
exports.default = orderHandlers;
