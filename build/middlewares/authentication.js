"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authenticate = (req, res, next) => {
    const openRequest = req.path == '/authenticate' ||
        req.path == '/' ||
        (req.method == 'GET' && req.path.startsWith('/products'));
    if (openRequest)
        next();
    try {
        const ourToken = process.env.TOKEN_SECRET;
        const authenticationHeader = req.headers.authorization;
        const token = authenticationHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, ourToken);
        next();
    }
    catch (err) {
        res.status(401);
        res.json('Access denied, invalied token');
    }
};
exports.default = authenticate;
