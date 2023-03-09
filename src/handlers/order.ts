import express, {Request, Response} from 'express'
import {Order, OrderStore} from '../models/order'
import jwt from 'jsonwebtoken'
import authenticate from '../middlewares/authentication'
import config from "../lib/config";

const token_secret = config.TOKEN_SECRET;

const store = new OrderStore()

const index = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.status(401).send('Access denied. No token provided.')
      }
      jwt.verify(token, token_secret as string)
      const orders = await store.index()
      res.json(orders)
    }
    catch (error) {
      console.error(error)
      res.status(500).send('An error occurred while fetching orders')
    }
}  
  
const show = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.status(401).send('Access denied. No token provided.')
      }
      jwt.verify(token, token_secret as string)
      const orders = await store.show(req.body.id)
      res.json(orders)
    }
    catch (error) {
      console.error(error)
      res.status(500).send('An error occurred while fetching the order')
    }
}

const create = async (req: Request, res: Response) => {
    const orders: Order = {
        o_id: req.body.o_id,
        user_id: req.body.user_id,
        order_status: req.body.order_status,
    }
    try {
        jwt.verify(req.body.token, token_secret as string)
    }
    catch (err) {
        res.status(401)
        res.json(`Invalid token ${err}`)
        return 
    }
    try {        
        const newOrder = await store.create(orders)
        var token = jwt.sign({orders: newOrder}, token_secret as string);
        res.json(token)
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

const getCOBUId = async (req: Request, res: Response) => {
    try {
        jwt.verify(req.body.token, token_secret as string)
    }
    catch (err) {
        res.status(401)
        res.json(`Invalid token ${err}`)
        return 
    }
    try {
        const currentOrder = await store.getCurrentOrderByUserId(req.body.id)
        res.json(currentOrder)
        return res.json(currentOrder);
    }
    catch (error) {
        res.status(400)
        res.json({ error })
    }
}

const getUO = async (req: Request, res: Response) => {
        try {
            const o_id: number = parseInt(req.params.id);
            const p_id: number = parseInt(req.body.product.id);
            const order_quantity: number = parseInt(req.body.order_quantity);
            const addProduct = await store.addProduct(order_quantity, o_id, p_id);
            res.json(addProduct);
        }
        catch (err) {
            res.status(400)
            res.json({ err })
        }
}

const orderHandlers = (app: express.Application) => {
    app.get('/orders', index)
    app.get('/orders/:id', show)
    app.post('/orders', authenticate, create)
    app.delete('/orders', destroy)
    app.get('//tusers/:id/orders', authenticate, getCOBUId)
    app.post('/tusers/:id/orders', authenticate, getUO)
    app.post('/authenticate', authenticate)
};

export default orderHandlers