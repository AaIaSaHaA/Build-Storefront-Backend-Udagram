"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_1 = require("../models/order");
const orderRoutes = (0, express_1.Router)();
const orderStore = new order_1.OrderStore();
const getOrder = async (req, res) => {
    try {
        let newOrders = await orderStore.index();
        const limit = parseInt(req.query.limit);
        const completed = req.query.completed;
        let completedBool;
        if (typeof completed !== 'undefined') {
            if (completed.toLocaleLowerCase() === 'true')
                completedBool = true;
            else if (completed.toLocaleLowerCase() === 'false')
                completedBool = false;
        }
        if (typeof completedBool !== 'undefined') {
            newOrders = newOrders.filter(order => order.order_status === completedBool);
        }
        if (limit) {
            if (limit < newOrders.length) {
                newOrders = newOrders.slice(0, limit);
            }
        }
        res.json(newOrders);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const getOrderByID = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const order = await orderStore.show(String(id));
            if (order) {
                res.json(order);
            }
            else {
                res.status(404).send('resource is not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
    else {
        res.sendStatus(404);
    }
};
const createOrder = async (req, res) => {
    try {
        const o_id = parseInt(req.body.o_id);
        const user_id = parseInt(req.body.user_id);
        const order_status = req.body.order_status;
        const newOrder = await orderStore.create({ o_id, user_id, order_status });
        res.json(newOrder);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const deleteOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const order = await orderStore.delete(String(id));
        if (order) {
            res.status(200).send(order);
        }
        else {
            res.status(404).send({ error: `Could not find order with id ${id}` });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
};
orderRoutes.get('/', getOrder);
orderRoutes.get('/:id', getOrderByID);
orderRoutes.post('/', createOrder);
orderRoutes.delete('/:id', deleteOrder);
exports.default = orderRoutes;
