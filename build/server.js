"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const product_1 = __importDefault(require("./handlers/product"));
const order_1 = __importDefault(require("./handlers/order"));
const tuser_1 = __importDefault(require("./handlers/tuser"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
(0, product_1.default)(app);
(0, order_1.default)(app);
(0, tuser_1.default)(app);
app.listen(port, () => {
    console.log(`starting app on: ${port}`);
});
exports.default = app;
