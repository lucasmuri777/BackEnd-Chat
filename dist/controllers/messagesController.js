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
exports.renderMessages = exports.sendMessage = void 0;
const Chats_1 = __importDefault(require("../models/Chats"));
const User_1 = __importDefault(require("../models/User"));
const Messages_1 = __importDefault(require("../models/Messages"));
const accountContext_1 = require("../helpers/accountContext");
const multer_1 = require("../helpers/multer");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.body.id && req.body.message && req.body.type) {
        let user = (0, accountContext_1.userContext)(req);
        let { id, message, type } = req.body;
        let filename = '';
        if (user) {
            if (type == 'chat') {
                try {
                    let chat = yield Chats_1.default.findById(id);
                    if (chat) {
                        let isMember = chat.members.indexOf(user.email);
                        if (isMember != -1) {
                            const generatedFileName = (0, multer_1.getGeneratedFileName)();
                            if (req.file) {
                                filename = generatedFileName;
                            }
                            let messageData = yield Messages_1.default.create({
                                author: user.email,
                                name: user.name,
                                authorPhoto: user.photo,
                                message: message,
                                image: filename,
                                to: {
                                    id: id,
                                    typeMsg: 'chat'
                                }
                            });
                            res.json({ status: true, message: messageData });
                            return;
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            if (type == 'friend') {
                try {
                    let friend = yield User_1.default.findById(id);
                    if (friend) {
                        let isFriend = friend.friends.indexOf(user.email);
                        if (isFriend != -1) {
                            const generatedFileName = (0, multer_1.getGeneratedFileName)();
                            if (req.file) {
                                filename = generatedFileName;
                            }
                            let messageData = yield Messages_1.default.create({
                                author: user.email,
                                name: user.name,
                                authorPhoto: user.photo,
                                message: message,
                                image: filename,
                                to: {
                                    id: id,
                                    typeMsg: 'friend'
                                }
                            });
                            res.json({ status: true, message: messageData });
                            return;
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
    }
    res.json({ status: false });
});
exports.sendMessage = sendMessage;
const renderMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.params.id && req.params.type) {
        try {
            let user = (0, accountContext_1.userContext)(req);
            if (user) {
                let { id, type } = req.params;
                if (type == 'chat') {
                    let chat = yield Chats_1.default.findById(id);
                    if (chat) {
                        let isMember = chat.members.indexOf(user.email);
                        if (isMember != -1) {
                            let messagesFind = yield Messages_1.default.find({
                                to: {
                                    id: id,
                                    typeMsg: 'chat'
                                }
                            });
                            let chatData = {
                                _id: chat.id,
                                name: chat.name,
                                members: chat.members,
                                owner: chat.owner,
                                photo: chat.photo
                            };
                            res.json({ messages: messagesFind, chat: chatData });
                            return;
                        }
                    }
                }
                if (type == 'friend') {
                    let friend = yield User_1.default.findById(id);
                    if (friend) {
                        let isFriend = friend.friends.indexOf(user.email);
                        if (isFriend != -1) {
                            let messagesFind = yield Messages_1.default.find({
                                author: user.email,
                                to: {
                                    id: id,
                                    typeMsg: 'friend'
                                }
                            });
                            let messagesFind2 = yield Messages_1.default.find({
                                author: friend.email,
                                to: {
                                    id: user.id,
                                    typeMsg: 'friend'
                                }
                            });
                            messagesFind.push(...messagesFind2);
                            messagesFind.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
                            let friendData = {
                                _id: friend.id,
                                email: friend.email,
                                name: friend.name,
                                friends: friend.friends,
                                photo: friend.photo
                            };
                            res.json({ messages: messagesFind, friend: friendData });
                            return;
                        }
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
            res.json({ status: false });
            return;
        }
        res.json({ status: false });
        return;
    }
    res.json({ status: false });
    return;
});
exports.renderMessages = renderMessages;
