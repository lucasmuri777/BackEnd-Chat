"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.Auth = {
    private: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let sucess = false;
        if (req.headers.authorization) {
            const [authType, token] = req.headers.authorization.split(' ');
            if (authType === 'Bearer') {
                try {
                    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                    if (!decoded || typeof decoded !== 'object' || !('email' in decoded)) {
                        return false;
                    }
                    let hasUser = yield User_1.default.find({
                        email: decoded.email,
                    });
                    if (hasUser.length > 0) {
                        sucess = true;
                    }
                }
                catch (err) {
                    sucess = false;
                }
            }
        }
        if (sucess) {
            next();
            return;
        }
        res.status(403);
        res.json({ error: 'Unauthorized' });
    })
};
