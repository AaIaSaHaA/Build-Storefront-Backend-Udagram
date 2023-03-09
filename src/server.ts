import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import productHandlers from './handlers/product';
import orderHandlers from './handlers/order';
import tuserHandlers from './handlers/tuser';

const app: Application = express()
const port: number = 3000;

app.use(bodyParser.json())

app.get('/', async (req: Request, res: Response): Promise<void> =>{
    res.sendFile(__dirname + '/views/index.html');
});

productHandlers(app);
orderHandlers(app);
tuserHandlers(app);

app.listen(port, () => {
    console.log(`starting app on: ${port}`)
})

export default app;