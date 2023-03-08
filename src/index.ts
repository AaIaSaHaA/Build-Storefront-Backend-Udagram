import express, { Request, Response, Application } from 'express'
import { container } from './container'

const app: express.Application = express()
container(app);
export default app;