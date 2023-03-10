import { Request, Response, Application } from 'express'
import logger from './middlewares/authentication'
import productHandlers from './handlers/product'
import orderHandlers from './handlers/order'
import tuserHandlers from './handlers/tuser'

const port: number = 3000;
export const container = (app:Application):void => {
    app.use([logger])
    app.use('/product', productHandlers)
    app.use('/order', orderHandlers)
    app.use('/tuser', tuserHandlers)

    app.get('/', async (req: Request, res: Response): Promise<void> =>{
        res.sendFile(__dirname + '/views/index.html');
    });

    app.listen(port, () => {
        console.log(`starting app on: ${port}`)
    })
}
