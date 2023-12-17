"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const mongo_1 = require("./instances/mongo");
const multer_1 = require("multer");
const socketIo_1 = require("./socketIo"); // Importe httpServer e socketIo do arquivo socketSetup.js
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config();
(0, mongo_1.mongoConnect)();
exports.server = (0, express_1.default)();
exports.server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});
exports.server.use((0, cors_1.default)({
    origin: 'https://front-end-chat-beta.vercel.app/',
    methods: ['GET', 'POST'],
    credentials: true
}));
exports.server.use(express_1.default.json());
exports.server.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
exports.server.use(express_1.default.urlencoded({ extended: true }));
exports.server.use(api_1.default);
exports.server.use((req, res) => {
    res.status(404);
    res.json({ error: 'Endpoint not found' });
});
const errorHandler = (err, req, res, next) => {
    res.status(400); //BAD REQUEST
    if (err instanceof multer_1.MulterError) {
        res.json({ error: err.code });
        return;
    }
    console.log(err);
    res.json({ error: 'Ocorreu algum erro' });
};
exports.server.use(errorHandler);
exports.server.listen(process.env.PORT);
socketIo_1.httpServer.listen(3333);
