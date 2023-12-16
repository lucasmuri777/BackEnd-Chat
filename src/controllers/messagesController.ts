import { Request, Response } from "express";
import chats, {ChatType} from '../models/Chats';
import users from '../models/User';
import messages from '../models/Messages';
import { userContext } from "../helpers/accountContext";

export const sendMessage = async (req: Request, res: Response) => {
    if(req.headers.authorization && req.body.id && req.body.message && req.body.type){
        let user = userContext(req)
        let {id, message, type} = req.body
        let filename = ''
        if(user){
            if(type == 'chat'){
                try{
                    let chat = await chats.findById(id)
                    if(chat){
                        let isMember = chat.members.indexOf(user.email)


                        if(isMember != -1){
            
                            if(req.file){
                                filename = req.file.filename
                            }

                            let messageData = await messages.create({
                                author: user.email,
                                name: user.name,
                                authorPhoto: user.photo,
                                message: message,
                                image: filename,
                                to: {
                                    id: id,
                                    typeMsg: 'chat'
                                }
                            })

                            res.json({status: true, message: messageData})
                            return;
                        }
                    }
                }catch(err){
                    console.log(err)
                }
            }
            if(type == 'friend'){
                try{
                    let friend = await users.findById(id)
                    if(friend){
                        let isFriend = friend.friends.indexOf(user.email)
                        if(isFriend != -1){
                            if(req.file){
                                filename = req.file.filename
                            }
                            
                            let messageData = await messages.create({
                                author: user.email,
                                name: user.name,
                                authorPhoto: user.photo,
                                message: message,
                                image: filename,
                                to: {
                                    id: id,
                                    typeMsg: 'friend'
                                }
                            })
                            res.json({status: true, message: messageData})
                            return;
                        }
                    }
                }catch(err){
                    console.log(err)
                }
            }   
        }
    }
    res.json({status: false})
}

export const renderMessages = async (req: Request, res: Response) => {
    if(req.headers.authorization && req.params.id && req.params.type){
        try{
            let user = userContext(req)
            if(user){
                let {id, type} = req.params
                if(type == 'chat'){
                    let chat = await chats.findById(id)
                    if(chat)
                    {
                        let isMember = chat.members.indexOf(user.email)
                        if(isMember != -1){
                            let messagesFind = await messages.find({
                                to: {
                                    id: id,
                                    typeMsg: 'chat'
                                }
                            })
                            let chatData = {
                                _id: chat.id,
                                name: chat.name,
                                members: chat.members,
                                owner: chat.owner,
                                photo: chat.photo
                            }
                            res.json({messages: messagesFind, chat: chatData})
                            return;
                        }
                        
                    }
                }
                if(type == 'friend'){
                    let friend = await users.findById(id)
                    if(friend){
                        let isFriend = friend.friends.indexOf(user.email)
                        if(isFriend != -1){
                            let messagesFind = await messages.find({
                                author: user.email,
                                to: {
                                    id: id,
                                    typeMsg: 'friend'
                                }
                            })
                            let messagesFind2 = await messages.find({
                                author: friend.email,
                                to:{
                                    id: user.id,
                                    typeMsg: 'friend'
                                }

                            })
                            messagesFind.push(...messagesFind2);
                            messagesFind.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
                            let friendData = {
                                _id: friend.id,
                                email: friend.email,
                                name: friend.name,
                                friends: friend.friends,
                                photo: friend.photo
                            }
                            res.json({messages: messagesFind, friend: friendData})
                            return;
                        }
                    }
                }
            }
        }catch(err){
            console.log(err)
            res.json({status: false})
            return;
        }
        res.json({status: false})
        return;
    }
    res.json({status: false})
    return;
    
}

