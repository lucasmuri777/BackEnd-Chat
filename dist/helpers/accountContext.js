"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContext = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userContext = (vis) => {
    var _a;
    let token = (_a = vis.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return false;
    }
    let decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken || typeof decodedToken !== 'object' || !('email' in decodedToken)) {
        return false;
    }
    return decodedToken;
};
exports.userContext = userContext;
