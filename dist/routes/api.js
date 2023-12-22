"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../helpers/multer");
const AccountController = __importStar(require("../controllers/accountController"));
const ChatController = __importStar(require("../controllers/chatController"));
const FriendController = __importStar(require("../controllers/friendController"));
const MessagesController = __importStar(require("../controllers/messagesController"));
const SearchController = __importStar(require("../controllers/searchController"));
//configurando o multer para envio de imagens
const router = (0, express_1.Router)();
router.post('/login', AccountController.login);
router.get('/ping', AccountController.ping);
router.post('/register', AccountController.register);
router.post('/hasUser', AccountController.hasUser);
router.post('/userInfos', auth_1.Auth.private, AccountController.getUserInfos);
router.post('/editUser', auth_1.Auth.private, multer_1.upload, AccountController.editUser);
router.get('/renderInvites', auth_1.Auth.private, AccountController.renderInvites);
router.get('/home', auth_1.Auth.private, AccountController.home);
//chats routers controllers
router.post('/createChat', auth_1.Auth.private, multer_1.upload, ChatController.createChat);
router.post('/enterChat', auth_1.Auth.private, ChatController.enterChat);
//invites/friends routers controllers
router.post('/sendInvite', auth_1.Auth.private, FriendController.sendInvite);
router.post('/inviteAccept', auth_1.Auth.private, FriendController.inviteAccept);
router.post('/remove', auth_1.Auth.private, FriendController.removeInviteAndRemoveFriend);
//mensagens routers controllers
router.post('/sendMessage', auth_1.Auth.private, multer_1.upload, MessagesController.sendMessage);
router.get('/renderMessages/:type/:id', auth_1.Auth.private, MessagesController.renderMessages);
router.post('/search', auth_1.Auth.private, SearchController.search);
exports.default = router;
