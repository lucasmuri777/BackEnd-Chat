import { Router } from 'express';
import {Auth} from '../middlewares/auth'
import { upload } from '../helpers/multer'

import * as AccountController from '../controllers/accountController';
import * as ChatController from '../controllers/chatController';
import * as FriendController from '../controllers/friendController';
import * as MessagesController from '../controllers/messagesController';
import * as SearchController from '../controllers/searchController';
//configurando o multer para envio de imagens


const router = Router();

router.post('/login', AccountController.login);
router.post('/register', AccountController.register);
router.post('/hasUser', AccountController.hasUser);
router.post('/userInfos',Auth.private ,AccountController.getUserInfos);

router.post('/editUser',Auth.private, upload.single('image'),AccountController.editUser);

router.get('/renderInvites', Auth.private, AccountController.renderInvites);
router.get('/home', Auth.private , AccountController.home);

//chats routers controllers
router.post('/createChat',Auth.private, upload.single('image') ,  ChatController.createChat);
router.post('/enterChat', Auth.private, ChatController.enterChat);

//invites/friends routers controllers
router.post('/sendInvite', Auth.private, FriendController.sendInvite)
router.post('/inviteAccept', Auth.private, FriendController.inviteAccept)
router.post('/remove', Auth.private, FriendController.removeInviteAndRemoveFriend)

//mensagens routers controllers
router.post('/sendMessage', Auth.private, upload.single('image'), MessagesController.sendMessage);
router.get('/renderMessages/:type/:id', Auth.private, MessagesController.renderMessages);

router.post('/search', Auth.private, SearchController.search);
export default router;