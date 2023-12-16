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
exports.removeInviteAndRemoveFriend = exports.inviteAccept = exports.sendInvite = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const accountContext_1 = require("../helpers/accountContext");
dotenv_1.default.config();
const sendInvite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.body.emailInvite) {
        try {
            let user = (0, accountContext_1.userContext)(req);
            if (user) {
                let { emailInvite } = req.body;
                if (emailInvite == user.email) {
                    res.json({ status: false });
                    return;
                }
                let hasUser = yield User_1.default.findOne({
                    email: emailInvite
                });
                let hasYou = yield User_1.default.findOne({
                    email: user.email
                });
                if (hasUser) {
                    let hasUserInvite = hasUser === null || hasUser === void 0 ? void 0 : hasUser.invites.indexOf(user.email);
                    let hasFriend = hasUser === null || hasUser === void 0 ? void 0 : hasUser.friends.indexOf(user.email);
                    let youHasInvite = hasYou === null || hasYou === void 0 ? void 0 : hasYou.invites.indexOf(emailInvite);
                    if (hasUserInvite == -1 && hasFriend == -1 && youHasInvite == -1) {
                        yield User_1.default.updateOne({
                            email: emailInvite
                        }, {
                            $push: {
                                invites: user.email
                            }
                        });
                        res.status(200);
                        res.json({ sendInvite: true });
                        return;
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    res.json({ status: false });
});
exports.sendInvite = sendInvite;
const inviteAccept = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.body.emailInvite) {
        try {
            let user = (0, accountContext_1.userContext)(req);
            if (user) {
                let { emailInvite } = req.body;
                let hasUser = yield User_1.default.findOne({
                    email: user.email
                });
                if (hasUser) {
                    let hasUserInvite = hasUser.invites.indexOf(emailInvite);
                    let hasFriend = hasUser.friends.indexOf(emailInvite);
                    if (hasUserInvite != -1 && hasFriend == -1) {
                        yield User_1.default.updateOne({
                            email: user.email
                        }, {
                            $push: {
                                friends: emailInvite
                            },
                            $pull: {
                                invites: emailInvite
                            }
                        });
                        yield User_1.default.updateOne({
                            email: emailInvite
                        }, {
                            $push: {
                                friends: user.email
                            }
                        });
                    }
                    else {
                        res.status(400);
                        res.json({ inviteAccept: false });
                        return;
                    }
                    res.status(200);
                    res.json({ inviteAccept: true });
                    return;
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    res.json({ status: false });
});
exports.inviteAccept = inviteAccept;
const removeInviteAndRemoveFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.body.emailInvite) {
        try {
            let user = (0, accountContext_1.userContext)(req);
            if (user) {
                let { emailInvite } = req.body;
                let hasUser = yield User_1.default.findOne({
                    email: user.email
                });
                if (hasUser) {
                    let hasUserInvite = hasUser.invites.indexOf(emailInvite);
                    let hasFriend = hasUser.friends.indexOf(emailInvite);
                    if (hasUserInvite != -1 && hasFriend == -1) {
                        yield User_1.default.updateOne({
                            email: user.email
                        }, {
                            $pull: {
                                invites: emailInvite
                            }
                        });
                    }
                    if (hasUserInvite == -1 && hasFriend != -1) {
                        yield User_1.default.updateOne({
                            email: user.email
                        }, {
                            $pull: {
                                friends: emailInvite
                            }
                        });
                        yield User_1.default.updateOne({
                            email: emailInvite
                        }, {
                            $pull: {
                                friends: user.email
                            }
                        });
                    }
                    if (hasUserInvite == -1 && hasFriend == -1) {
                        res.status(400);
                        res.json({ status: false });
                        return;
                    }
                    res.status(200);
                    res.json({ inviteReject: true });
                    return;
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    res.status(400);
    res.json({ status: false });
});
exports.removeInviteAndRemoveFriend = removeInviteAndRemoveFriend;
