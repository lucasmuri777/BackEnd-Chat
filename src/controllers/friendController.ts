import { Request, Response } from "express";
import dotenv from 'dotenv';
import  users  from '../models/User';
import { userContext } from "../helpers/accountContext";

dotenv.config()

export const sendInvite = async (req: Request, res: Response) => {
    if(req.headers.authorization && req.body.emailInvite){
        try{
            let user = userContext(req)
            if(user){
                let { emailInvite } = req.body
                if(emailInvite == user.email){
                    res.json({status: false})
                    return;
                }
                let hasUser = await users.findOne({
                    email: emailInvite
                })
                let hasYou = await users.findOne({
                    email: user.email
                })
                
                if(hasUser){
                    let hasUserInvite = hasUser?.invites.indexOf(user.email)
                    let hasFriend = hasUser?.friends.indexOf(user.email)
                    let youHasInvite = hasYou?.invites.indexOf(emailInvite)
                   
                    if(hasUserInvite == -1 && hasFriend == -1 && youHasInvite == -1){

                        await users.updateOne(
                            {
                                email: emailInvite
                            },{
                                $push: {
                                    invites: user.email
                                }
                            }
                        )
                        res.status(200)
                        res.json({sendInvite: true})
                        return;
                    }
                }
            }
        }catch(err){
            console.log(err)
        }
    }
    res.json({status: false})
   
}

export const inviteAccept = async (req: Request, res: Response) => {
    if(req.headers.authorization && req.body.emailInvite){
        try{
            let user = userContext(req)
            if(user){
                let { emailInvite } = req.body
                let hasUser = await users.findOne({
                    email: user.email
                })
                if(hasUser){
                    let hasUserInvite = hasUser.invites.indexOf(emailInvite);
                    let hasFriend = hasUser.friends.indexOf(emailInvite);
                    if(hasUserInvite != -1 && hasFriend == -1){
                        await users.updateOne(
                            {
                                email: user.email
                            },{
                                $push: {
                                    friends: emailInvite
                                },
                                $pull: {
                                    invites: emailInvite
                                }

                            }
                        )
                        await users.updateOne(
                            {
                                email: emailInvite
                            },{
                                $push: {
                                    friends: user.email
                                }
                            }
                        )
                    }else{
                        res.status(400)
                        res.json({inviteAccept: false})
                        return;
                    }
                    res.status(200)
                    res.json({inviteAccept: true})
                    return;
                }
                
            }
        }catch(err){
            console.log(err)
        }
    }
    res.json({status: false})
}

export const removeInviteAndRemoveFriend = async (req: Request, res: Response) => {
    if(req.headers.authorization && req.body.emailInvite){
        try{
            let user = userContext(req)
            if(user){
                let { emailInvite } = req.body
                let hasUser = await users.findOne({
                    email: user.email
                })
                if(hasUser){
                    let hasUserInvite = hasUser.invites.indexOf(emailInvite);
                    let hasFriend = hasUser.friends.indexOf(emailInvite);

                    if(hasUserInvite != -1 && hasFriend == -1){
                        await users.updateOne(
                            {
                                email: user.email
                            },{
                                $pull: {
                                    invites: emailInvite
                                }
                            }
                        )
                       
                    }
                    if(hasUserInvite == -1 && hasFriend != -1){
                        await users.updateOne(
                            {
                                email: user.email
                            },{
                                $pull: {
                                    friends: emailInvite
                                }
                            }
                        )

                        await users.updateOne(
                            {
                                email: emailInvite
                            },
                            {
                                $pull: {
                                    friends: user.email
                                }
                            }
                        )
                    }
                    if(hasUserInvite == -1 && hasFriend == -1){
                        res.status(400);
                        res.json({status: false})
                        return;
                    }

                    res.status(200)
                    res.json({inviteReject: true})
                    return;
                }

            }
        }catch(err){
            console.log(err)
        }
    }
    res.status(400)
    res.json({status: false})
}
