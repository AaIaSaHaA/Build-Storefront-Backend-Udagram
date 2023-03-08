import express, {Request, Response} from 'express'
import {Tuser, TuserStore} from '../models/tuser'
import jwt from 'jsonwebtoken'
import config from "../lib/config";

const token_secret = config.TOKEN_SECRET;

const store = new TuserStore()

const index = async (_req: Request, res: Response) => {
    const tusers = await store.index()
    try {
        jwt.verify(_req.body.token, token_secret as string)
    }
    catch (err) {
        res.status(401)
        res.json(`Invalid token ${err}`)
        return 
    }
    try {
        var token = jwt.sign({tusers}, token_secret as string);
        res.json(token)
    }
    catch(err) {
        res.status(400)
        res.json(err)
    }
}
const show = async (req: Request, res: Response) => {
    const tusers = await store.show(req.body.id)
    try {
        jwt.verify(req.body.token, token_secret as string)
    }
    catch (err) {
        res.status(401)
        res.json(`Invalid token ${err}`)
        return 
    }
    try {
        var token = jwt.sign({tusers}, token_secret as string);
        res.json(token)
    }
    catch(err) {
        res.status(400)
        res.json(err)
    }
}
const create = async (req: Request, res: Response) => {
    try {
        const tusers: Tuser = {
            u_id: req.body.u_id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            u_password: req.body.u_password,
        }
        const newTuser = await store.create(tusers)
        const token = jwt.sign({
            u_id: newTuser.u_id,
            firstName: newTuser.firstName,
            lastName: newTuser.lastName,
            u_password: newTuser.u_password,
        }, token_secret as string);
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

const authenticate = async (req: Request, res: Response) => {
    try {    
        const tuser = (await store.authenticate(
            req.body.firstName,
            req.body.u_password,
        )) as Tuser;
        const token = jwt.sign({
            u_id: req.body.u_id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }, token_secret as string);
        res.json(token)
    }
    catch(error) {
        res.status(401)
        res.json({error: 'Incorrect username or password'});
    }
};

const tuserHandlers = (app: express.Application) => {
    app.get('/tusers', index)
    app.get('/tusers/:id', show)
    app.post('/tusers', authenticate, create)
    app.delete('/tusers', authenticate, destroy)
    app.post('/authenticate', authenticate)
}

export default tuserHandlers