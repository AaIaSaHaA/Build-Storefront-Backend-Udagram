import express, { Application, Request, Response, Router } from 'express';
import { Order, OrderStore} from "../models/order";

const orderRoutes = Router();
const orderStore = new OrderStore()

const getOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        let newOrders: Order[] = await orderStore.index()
        const limit: number = parseInt(req.query.limit as (string))
        const completed: string = req.query.completed as string
        let completedBool: boolean | undefined
        
        if (typeof completed !== 'undefined') {
            if (completed.toLocaleLowerCase() === 'true')
                completedBool = true
            else if (completed.toLocaleLowerCase() === 'false')
                completedBool = false
        }
        if (typeof completedBool !== 'undefined') {
            newOrders = newOrders.filter(order => order.order_status === completedBool)
        }
        if (limit) {
            if (limit < newOrders.length) {
                newOrders = newOrders.slice(0, limit)
            }
        }
        res.json(newOrders);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const getOrderByID = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string)
    if (id) {
        try {
            const order: Order | undefined = await orderStore.show(String(id))
            if (order) {
                res.json(order);
            }
            else {
                res.status(404).send('resource is not found')
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
    else {res.sendStatus(404);}
};

const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const o_id: number = parseInt(req.body.o_id as string);
        const user_id: number = parseInt(req.body.user_id as string);
        const order_status: boolean = req.body.order_status;
        const newOrder = await orderStore.create({o_id, user_id, order_status});
        res.json(newOrder);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: number = parseInt(req.params.id);
        const order: Order | undefined = await orderStore.delete(String(id));
        if (order) {
            res.status(200).send(order);
        } else {
            res.status(404).send({error: `Could not find order with id ${id}`});
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

orderRoutes.get('/', getOrder);
orderRoutes.get('/:id', getOrderByID);
orderRoutes.post('/', createOrder);
orderRoutes.delete('/:id', deleteOrder)
    
    export default orderRoutes;