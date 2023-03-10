import express, { Application, Request, Response, Router } from 'express';
import { Tuser, TuserStore} from "../models/tuser";

const tuserRoutes = Router();
const tuserStore = new TuserStore()

const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const tusers = await tuserStore.index()
        res.json(tusers);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const getUserByID = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        const tuser = await tuserStore.show(id)
        if (tuser) {
            res.json(tuser);
        } else {
            res.status(404).send('resource not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
    const {u_id, firstname, lastname, u_password } = req.body;
    try {
        const newTuser = await tuserStore.create({u_id, firstname, lastname, u_password});
        res.json(newTuser);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        const deleted = await tuserStore.delete(id);
        if (deleted) {
            res.sendStatus(204);
        } else {
            res.status(404).send('resource not found');
        }
    } catch (err) {
        console.log(err);
    }
};

tuserRoutes.get('/', getUser);
tuserRoutes.get('/:id', getUserByID);
tuserRoutes.post('/', createUser);
tuserRoutes.delete('/:id', deleteUser)
    
export default tuserRoutes;