import express, {Request, Response} from 'express'
import {Product, ProductStore} from '../models/product'
import jwt from 'jsonwebtoken'
import config from "../lib/config";

const token_secret = config.TOKEN_SECRET;

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
    try {
      const products = await store.index()
      res.json(products)
    }
    catch (error) {
      console.error(error)
      res.status(500).send("An error occurred while fetching products")
    }
  }

const show = async (req: Request, res: Response) => {
    try {
      const products = await store.show(req.params.id)
      if (products) {
        res.json(products)
      } else {
        res.status(404).json('Product is not found')
      }
    }
    catch (error) {
      console.error(error)
      res.status(500).send("An error occurred while fetching the product")
    }
  }
  

const create = async (req: Request, res: Response) => {
    try {
        const products: Product = {
            p_id: req.body.p_id,
            p_name: req.body.p_name,
            price: req.body.price,
        }
        const newProduct = await store.create(products)
        res.json(newProduct)
    }
    catch(err) {
        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        jwt.verify(req.body.token, token_secret as string)
    }
    catch (err) {
        res.status(401)
        res.json(`Invalid token ${err}`)
        return 
    }
    try {
        const deleted = await store.delete(req.body.id)
        res.json(deleted)
    }
    catch (error) {
        res.status(400)
        res.json({ error })
    }
}

const productHandlers = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products', create)
    app.delete('/products', destroy)
}

export default productHandlers