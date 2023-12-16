import { Request, Response } from "express";
import chats  from '../models/Chats';
import bcrypt from 'bcrypt';
import { unlink } from 'fs/promises'
import { userContext } from "../helpers/accountContext";


export const createChat = async (req: Request, res: Response) => {
    let user = userContext(req);
    if(!user){
        res.status(401)
        res.json({error: 'Unauthorized'})
        return;
    }
    if(req.body.name && req.body.password){
    
        if(!req.file){
            res.status(400)
            res.json({ error: 'Arquivo invalido'})
            return;
        }

        const {name, password} = req.body;
        try{
            const  filename = req.file.filename + '.jpg';
            //biblioteca sharp para a manipulção de imagens
            let newChat = {
                name,
                password,
                photo: filename,
                members: [user.email],
                owner: [user.email]
            }
            
            let newChatCreated = await chats.create(newChat);

            res.json({success: true})
            return;

        }catch(err){
            console.log(err);
            res.status(400)
            res.json({ error: err})
            return;
        }

    }
    res.status(400)
    res.json({ error: 'Name and password are required'})
}

export const enterChat = async (req: Request, res: Response) => {
    if(req.headers.authorization && req.body.id && req.body.password){
        try{
            let user = userContext(req)
        if(user){
            let chat = await chats.findById(req.body.id)
            if(chat){
                let isMember = chat.members.indexOf(user.email)
                if(isMember == -1){
                    let isValid = bcrypt.compareSync(req.body.password, chat.password)
                    console.log(isValid)
                    if(isValid){
                        chat.members.push(user.email)
                        await chat.save()
                        res.json({success: true})
                        return;
                    }
                }

            }
        }

        }catch(err){
            res.json({success: false})
            console.log(err)
            return;
        }
    }
    res.json({success: false})
}