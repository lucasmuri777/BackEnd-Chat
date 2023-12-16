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
exports.renderInvites = exports.editUser = exports.getUserInfos = exports.hasUser = exports.home = exports.login = exports.register = exports.ping = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const Chats_1 = __importDefault(require("../models/Chats"));
const accountContext_1 = require("../helpers/accountContext");
dotenv_1.default.config();
const ping = (req, res) => {
    res.json({ status: true });
    return;
};
exports.ping = ping;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.email && req.body.password && req.body.name) {
        let { email, password, name } = req.body;
        let hasUser = yield User_1.default.find({
            email: email,
        });
        if (hasUser.length > 0) {
            res.status(400);
            res.json({ error: 'User already exists' });
            return;
        }
        let user = {
            email,
            password,
            name,
            photo: 'default-perfil.jpg'
        };
        try {
            let newUser = yield User_1.default.create(user);
            let token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, name: newUser.name, photo: newUser.photo }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
            res.status(201);
            res.json({ status: true, token, user: { id: newUser.id, email: newUser.email, name: newUser.name, photo: newUser.photo } });
            return;
        }
        catch (err) {
            console.log(err);
        }
        //criação de um token para o user usar
    }
    res.status(400);
    res.json('More informations are required');
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.email && req.body.password) {
        let { email, password } = req.body;
        let user = yield User_1.default.find({ email: email, });
        if (user.length > 0) {
            let isValid = bcrypt_1.default.compareSync(password, user[0].password);
            if (isValid) {
                let token = jsonwebtoken_1.default.sign({ id: user[0].id, email: user[0].email, name: user[0].name, photo: user[0].photo }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
                res.json({ status: true, token, user: { id: user[0].id, email: user[0].email, name: user[0].name, photo: user[0].photo } });
                return;
            }
        }
        res.status(401);
        res.json({ error: 'Email or password invalid' });
        return;
    }
    res.status(400);
    res.json({ error: 'Email and password are required' });
});
exports.login = login;
const home = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (0, accountContext_1.userContext)(req);
        if (!user) {
            res.status(401);
            res.json({ error: 'Unauthorized' });
            return;
        }
        let userEmail = user.email;
        const userChats = yield Chats_1.default.find({
            members: {
                $in: [userEmail]
            }
        });
        const friends = yield User_1.default.findOne({
            email: userEmail
        });
        let friendAccounts = [];
        if (friends && friends.friends && friends.friends.length > 0) {
            console.log(friends.friends.length);
            for (let i = 0; i < friends.friends.length; i++) {
                const friendSearch = yield User_1.default.find({
                    email: friends.friends[i]
                });
                if (friendSearch && friendSearch.length > 0) {
                    let details = {
                        _id: friendSearch[0]._id,
                        name: friendSearch[0].name,
                        email: friendSearch[0].email,
                        photo: friendSearch[0].photo,
                        password: '',
                        friends: [],
                        invites: []
                    };
                    friendAccounts.push(details);
                }
            }
        }
        res.json({ status: true, chats: userChats, friends: friendAccounts });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(401);
        res.json({ error: 'Unauthorized' });
        return;
    }
    res.status(400);
    res.json({ status: false });
});
exports.home = home;
const hasUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.id && req.headers.authorization) {
        try {
            let { id } = req.body;
            let user = yield User_1.default.findById(id);
            let decoded = (0, accountContext_1.userContext)(req);
            console.log(user);
            if (decoded) {
                if (user) {
                    if (user._id == decoded.id) {
                        res.status(200);
                        res.json({ status: true });
                        return;
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
            res.status(400);
            res.json({ status: false });
            return;
        }
    }
    res.status(400);
    res.json({ status: false });
    return;
});
exports.hasUser = hasUser;
const getUserInfos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.id && req.headers.authorization) {
        try {
            let { id } = req.body;
            let user = yield User_1.default.findById(id);
            let decoded = (0, accountContext_1.userContext)(req);
            if (decoded) {
                if (user) {
                    if (user.friends.indexOf(decoded.email) > -1) {
                        let data = {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            photo: user.photo
                        };
                        res.status(200);
                        res.json({ status: true, user: data });
                        return;
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
            res.status(400);
            res.json({ status: false });
            return;
        }
    }
    res.status(400);
    res.json({ status: false });
    return;
});
exports.getUserInfos = getUserInfos;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.body.id) {
        const user = (0, accountContext_1.userContext)(req);
        if (user) {
            if (user.id == req.body.id) {
                try {
                    let hasUser = yield User_1.default.findById(req.body.id);
                    if (hasUser) {
                        let { name } = req.body;
                        hasUser.name = name;
                        if (req.body.removeImage == 'true') {
                            hasUser.photo = 'default-perfil.jpg';
                        }
                        if (req.file && req.body.removeImage == 'false') {
                            hasUser.photo = req.file.filename;
                        }
                        yield hasUser.save();
                        res.status(200);
                        let user = {
                            id: hasUser._id,
                            name: hasUser.name,
                            email: hasUser.email,
                            photo: hasUser.photo
                        };
                        res.json({ status: true, user });
                        return;
                    }
                }
                catch (err) {
                    console.log(err);
                    res.status(400);
                    res.json({ status: false });
                    return;
                }
            }
        }
    }
    res.json({ status: false });
});
exports.editUser = editUser;
const renderInvites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        const user = (0, accountContext_1.userContext)(req);
        if (user) {
            let hasUser = yield User_1.default.findById(user.id);
            if (hasUser) {
                if (hasUser.invites) {
                    let invites = [];
                    for (let i = 0; i < hasUser.invites.length; i++) {
                        let userGet = yield User_1.default.findOne({ email: hasUser.invites[i] });
                        let data = {
                            email: userGet === null || userGet === void 0 ? void 0 : userGet.email,
                            name: userGet === null || userGet === void 0 ? void 0 : userGet.name,
                            photo: userGet === null || userGet === void 0 ? void 0 : userGet.photo,
                            id: userGet === null || userGet === void 0 ? void 0 : userGet._id,
                            friends: userGet === null || userGet === void 0 ? void 0 : userGet.friends
                        };
                        if (data) {
                            invites.push(data);
                        }
                        else {
                            return;
                        }
                    }
                    res.json({ status: true, invites });
                    return;
                }
            }
        }
    }
    res.json({ status: false });
    return;
});
exports.renderInvites = renderInvites;
