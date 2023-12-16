import { Request, Response } from "express";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import  users  from '../models/User';
import chats  from '../models/Chats';
import { userContext } from "../helpers/accountContext";

export const search = async (req: Request, res: Response) => {
    if(req.headers.authorization && req.body.search){
        let user = userContext(req)
        if(user){  
            try{
                let searchFriends = await users.find({
                    name: {$regex: req.body.search, $options: 'i'}
                }) 
                let searchFormat: any = []
                searchFriends.forEach((friend) => {
                    let data = {
                        id: friend.id,
                        name: friend.name,
                        email: friend.email,
                        photo: friend.photo,
                        friends: friend.friends
                    } 
                    searchFormat.push(data)
                })  

                let searchChats = await chats.find({
                    name: {$regex: req.body.search, $options: 'i'}
                })
                let chatFormat: any = []
                searchChats.forEach((chat) => {
                    let data = {
                        id: chat.id,
                        name: chat.name,
                        photo: chat.photo,
                        members: chat.members
                    } 
                    chatFormat.push(data)
                })
                let search = {
                    friends: searchFormat,
                    chats: chatFormat
                }
                res.json({status: true, search});
                return;
                
            }catch(err){
                console.log(err);
                res.json({status: false});
                return;
            }
        }
    }
    res.json({status: false})
    return;
}