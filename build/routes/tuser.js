"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tuser_1 = require("../models/tuser");
const tuserRoutes = (0, express_1.Router)();
const tuserStore = new tuser_1.TuserStore();
const getUser = async (req, res) => {
    try {
        const tusers = await tuserStore.index();
        res.json(tusers);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const getUserByID = async (req, res) => {
    const id = req.params.id;
    try {
        const tuser = await tuserStore.show(id);
        if (tuser) {
            res.json(tuser);
        }
        else {
            res.status(404).send('resource not found');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const createUser = async (req, res) => {
    const { u_id, firstName, lastName, u_password } = req.body;
    try {
        const newTuser = await tuserStore.create({ u_id, firstName, lastName, u_password });
        res.json(newTuser);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await tuserStore.delete(id);
        if (deleted) {
            res.sendStatus(204);
        }
        else {
            res.status(404).send('resource not found');
        }
    }
    catch (err) {
        console.log(err);
    }
};
tuserRoutes.get('/', getUser);
tuserRoutes.get('/:id', getUserByID);
tuserRoutes.post('/', createUser);
tuserRoutes.delete('/:id', deleteUser);
exports.default = tuserRoutes;
