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
exports.search = void 0;
const User_1 = __importDefault(require("../models/User"));
const Chats_1 = __importDefault(require("../models/Chats"));
const accountContext_1 = require("../helpers/accountContext");
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.body.search) {
        let user = (0, accountContext_1.userContext)(req);
        if (user) {
            try {
                let searchFriends = yield User_1.default.find({
                    name: { $regex: req.body.search, $options: 'i' }
                });
                let searchFormat = [];
                searchFriends.forEach((friend) => {
                    let data = {
                        id: friend.id,
                        name: friend.name,
                        email: friend.email,
                        photo: friend.photo,
                        friends: friend.friends
                    };
                    searchFormat.push(data);
                });
                let searchChats = yield Chats_1.default.find({
                    name: { $regex: req.body.search, $options: 'i' }
                });
                let chatFormat = [];
                searchChats.forEach((chat) => {
                    let data = {
                        id: chat.id,
                        name: chat.name,
                        photo: chat.photo,
                        members: chat.members
                    };
                    chatFormat.push(data);
                });
                let search = {
                    friends: searchFormat,
                    chats: chatFormat
                };
                res.json({ status: true, search });
                return;
            }
            catch (err) {
                console.log(err);
                res.json({ status: false });
                return;
            }
        }
    }
    res.json({ status: false });
    return;
});
exports.search = search;
