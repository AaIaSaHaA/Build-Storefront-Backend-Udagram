"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const authentication_1 = __importDefault(require("./middlewares/authentication"));
const product_1 = __importDefault(require("./routes/product"));
const order_1 = __importDefault(require("./routes/order"));
const tuser_1 = __importDefault(require("./routes/tuser"));
const port = 3000;
const container = (app) => {
    app.use([authentication_1.default]);
    app.use('/product', product_1.default);
    app.use('/order', order_1.default);
    app.use('/tuser', tuser_1.default);
    app.get('/', async (req, res) => {
        res.sendFile(__dirname + '/views/index.html');
    });
    app.listen(port, () => {
        console.log(`starting app on: ${port}`);
    });
};
exports.container = container;
