import bodyParser from 'body-parser';
import express, { Application, Request, Response, Router } from 'express';
import { Product, ProductStore} from "../models/product";

const productRoutes = Router();
const productStore = new ProductStore()

const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await productStore.index()
        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const getProductByID = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        const product = await productStore.show(id)
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('resource not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const createProduct = async (req: Request, res: Response): Promise<void> => {
    const { p_id, p_name, price } = req.body;
    try {
        const newProduct = await productStore.create({p_id, p_name, price});
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        const deleted = await productStore.delete(id);
        if (deleted) {
            res.sendStatus(204);
        } else {
            res.status(404).send('resource not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

productRoutes.get('/', getProduct);
productRoutes.get('/:id', getProductByID);
productRoutes.post('/', createProduct);
productRoutes.delete('/:id', deleteProduct)

export default productRoutes;