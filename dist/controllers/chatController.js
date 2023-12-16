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
exports.enterChat = exports.createChat = void 0;
const Chats_1 = __importDefault(require("../models/Chats"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const accountContext_1 = require("../helpers/accountContext");
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = (0, accountContext_1.userContext)(req);
    if (!user) {
        res.status(401);
        res.json({ error: 'Unauthorized' });
        return;
    }
    if (req.body.name && req.body.password) {
        if (!req.file) {
            res.status(400);
            res.json({ error: 'Arquivo invalido' });
            return;
        }
        const { name, password } = req.body;
        try {
            const filename = req.file.filename + '.jpg';
            //biblioteca sharp para a manipulção de imagens
            let newChat = {
                name,
                password,
                photo: filename,
                members: [user.email],
                owner: [user.email]
            };
            let newChatCreated = yield Chats_1.default.create(newChat);
            res.json({ success: true });
            return;
        }
        catch (err) {
            console.log(err);
            res.status(400);
            res.json({ error: err });
            return;
        }
    }
    res.status(400);
    res.json({ error: 'Name and password are required' });
});
exports.createChat = createChat;
const enterChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.body.id && req.body.password) {
        try {
            let user = (0, accountContext_1.userContext)(req);
            if (user) {
                let chat = yield Chats_1.default.findById(req.body.id);
                if (chat) {
                    let isMember = chat.members.indexOf(user.email);
                    if (isMember == -1) {
                        let isValid = bcrypt_1.default.compareSync(req.body.password, chat.password);
                        console.log(isValid);
                        if (isValid) {
                            chat.members.push(user.email);
                            yield chat.save();
                            res.json({ success: true });
                            return;
                        }
                    }
                }
            }
        }
        catch (err) {
            res.json({ success: false });
            console.log(err);
            return;
        }
    }
    res.json({ success: false });
});
exports.enterChat = enterChat;
