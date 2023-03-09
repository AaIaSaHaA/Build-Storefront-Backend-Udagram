"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = require("../models/product");
const productRoutes = (0, express_1.Router)();
const productStore = new product_1.ProductStore();
const getProduct = async (req, res) => {
    try {
        const products = await productStore.index();
        res.json(products);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const getProductByID = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await productStore.show(id);
        if (product) {
            res.json(product);
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
const createProduct = async (req, res) => {
    const { p_id, p_name, price } = req.body;
    try {
        const newProduct = await productStore.create({ p_id, p_name, price });
        res.json(newProduct);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await productStore.delete(id);
        if (deleted) {
            res.sendStatus(204);
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
productRoutes.get('/', getProduct);
productRoutes.get('/:id', getProductByID);
productRoutes.post('/', createProduct);
productRoutes.delete('/:id', deleteProduct);
exports.default = productRoutes;
