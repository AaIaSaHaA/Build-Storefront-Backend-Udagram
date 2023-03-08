import { Request, Response, Application } from 'express'
import logger from './middlewares/authentication'
import productRoutes from './routes/product'
import orderRoutes from './routes/order'
import tuserRoutes from './routes/tuser'

const port: number = 3000;
export const container = (app:Application):void => {
    app.use([logger])
    app.use('/product', productRoutes)
    app.use('/order', orderRoutes)
    app.use('/tuser', tuserRoutes)

    app.get('/', async (req: Request, res: Response): Promise<void> =>{
        res.sendFile(__dirname + '/views/index.html');
    });

    app.listen(port, () => {
        console.log(`starting app on: ${port}`)
    })
}
