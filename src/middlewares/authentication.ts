import { Request, Response, NextFunction } from "express";
import jwt, {Secret} from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const openRequest: boolean = 
        req.path == '/authenticate' ||
        req.path == '/' ||
        (req.method == 'GET' && req.path.startsWith('/products'));

        if (openRequest) next();

        try {
            const ourToken = process.env.TOKEN_SECRET as Secret;
            const authenticationHeader = req.headers.authorization as string;
            const token = authenticationHeader.split(' ')[1];
            jwt.verify(token, ourToken);
            next();
        }
        catch (err) {
            res.status(401);
            res.json('Access denied, invalied token')
        }
}

export default authenticate