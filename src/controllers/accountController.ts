import { Request, Response } from "express";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import  users, {UserType}  from '../models/User';
import chats  from '../models/Chats';
import { userContext } from "../helpers/accountContext";

dotenv.config()
type UserSendInfosType = {
    id: string;
    name: string;
    email: string;
    photo: string;
}
export const ping = (req: Request, res: Response) => {
    res.json({status: true});
    return;
}
export const register = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password && req.body.name){
        let { email, password, name } = req.body;

        let hasUser = await users.find({
            email: email,
        })
        if(hasUser.length > 0){
            res.status(400);
            res.json({error: 'User already exists'});
            return;
        }
        let user ={
            email,
            password,
            name,
            photo: 'default-perfil.jpg'
        }
        try{
            let newUser = await users.create(user);
            let token = JWT.sign(
                {id: newUser.id, email: newUser.email, name: newUser.name, photo: newUser.photo},
                process.env.JWT_SECRET_KEY as string,
                {expiresIn: '1d'}
            )
            res.status(201)
            res.json({status: true, token, user: {id: newUser.id, email: newUser.email, name: newUser.name, photo: newUser.photo}});
            return;
        }catch(err){
            console.log(err);
        }
        //criação de um token para o user usar
       
      
    }
    res.status(400)
    res.json('More informations are required')
}

export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password){
        let {email, password} = req.body;

        let user = await users.find({email: email,});
        if(user.length > 0){
            let isValid = bcrypt.compareSync(password, user[0].password);
            if(isValid) {
                let token = JWT.sign(
                    {id: user[0].id, email: user[0].email, name: user[0].name, photo: user[0].photo},
                    process.env.JWT_SECRET_KEY as string,
                    {expiresIn: '1d'}
                )
                res.json({status: true, token, user: {id: user[0].id, email: user[0].email, name: user[0].name, photo: user[0].photo}});
                return;
            }
        }
        res.status(401)
        res.json({error: 'Email or password invalid'})
        return;
    }
    res.status(400)
    res.json({error: 'Email and password are required'})
}

export const home = async (req: Request, res: Response) => {
  try{
    const user = userContext(req);
    if(!user){
        res.status(401)
        res.json({error: 'Unauthorized'})
        return;
    }
    let userEmail = user.email;
    const userChats = await chats.find({
        members:{
            $in: [userEmail]
        }
    })
    const friends = await users.findOne({
        email: userEmail
    })
    let friendAccounts: UserType[] = []
    if(friends && friends.friends && friends.friends.length > 0){
        console.log(friends.friends.length)
        for (let i = 0; i < friends.friends.length; i++) {
            const friendSearch: UserType[] = await users.find({
                email: friends.friends[i]
            })
            if(friendSearch && friendSearch.length > 0){
                let details: UserType = {
                    _id: friendSearch[0]._id as any,
                    name: friendSearch[0].name,
                    email: friendSearch[0].email,
                    photo: friendSearch[0].photo,
                    password: '',
                    friends: [],
                    invites: []
                }
                friendAccounts.push(details)
            }
            
        }
    }

    res.json({status: true, chats: userChats, friends: friendAccounts})
    return;

  }catch(err){
    console.log(err);
    res.status(401)
    res.json({error: 'Unauthorized'})
    return;
  }
  res.status(400)
  res.json({status: false})

}

export const hasUser = async (req: Request, res: Response) => {
    if(req.body.id && req.headers.authorization){
        try{
            let {id} = req.body;
            let user = await users.findById(id);
            let decoded = userContext(req);
            console.log(user)
            if(decoded){
                if(user){
                    if(user._id == decoded.id){
                        res.status(200)
                        res.json({status: true})
                        return;   
                    }  
                }
            }

        }catch(err){
            console.log(err);
            res.status(400)
            res.json({status: false})
            return
        }
        
    }
    res.status(400)
    res.json({status: false})
    return;
    
}
export const getUserInfos = async (req: Request, res: Response) => {
    if(req.body.id && req.headers.authorization){
        try{
            let {id} = req.body;
            let user = await users.findById(id);
            let decoded = userContext(req);
            if(decoded){
                if(user){
                    if(user.friends.indexOf(decoded.email) > -1){
                        let data: UserSendInfosType = {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            photo: user.photo
                        }
                        res.status(200)
                        res.json({status: true, user: data})
                        return;
                    }
                }
            }

        }catch(err){
            console.log(err);
            res.status(400)
            res.json({status: false})
            return
        }
        
    }
    res.status(400)
    res.json({status: false})
    return;
    
}

export const editUser = async (req: Request, res: Response) => {
    if(req.headers.authorization && req.body.id){
        const user = userContext(req);
        if(user){
            if(user.id == req.body.id){

                try{
                    let hasUser = await users.findById(req.body.id);
                    if(hasUser){
                        let {name} = req.body;
                        hasUser.name = name;
                        if(req.body.removeImage == 'true'){
                            hasUser.photo = 'default-perfil.jpg';
                        }
                        
                        if(req.file && req.body.removeImage == 'false'){
                            hasUser.photo = req.file.filename;
                        }
                        await hasUser.save();
                        res.status(200)
                        let user = {
                            id: hasUser._id,
                            name: hasUser.name,
                            email: hasUser.email,
                            photo: hasUser.photo
                        }
                        res.json({status: true, user})
                        return;
                    }

                }catch(err){
                    console.log(err);
                    res.status(400)
                    res.json({status: false})
                    return
                }
            }
        }
    }
    res.json({status: false})
}

type invite = {
    email: string,
    name: string,
    photo: string,
    id: string
    friends: string[]
}

export const renderInvites = async (req: Request, res: Response) => {
    if(req.headers.authorization){
        const user = userContext(req);
        if(user){
            let hasUser = await users.findById(user.id);
            if(hasUser){
                if(hasUser.invites){
                    let invites: invite[] = []
                    for(let i = 0; i < hasUser.invites.length; i++){

                        let userGet = await users.findOne({email: hasUser.invites[i]});
                        let data: invite = {
                            email: userGet?.email as string,
                            name: userGet?.name as string,
                            photo: userGet?.photo as string,
                            id: userGet?._id as string,
                            friends: userGet?.friends as string[]
                        }
                        if(data){
                            invites.push(data)
                        }else{
                            return;
                        }
                    }
                    res.json({status: true, invites})
                    return;
                }
            }
        }
    }
    res.json({status: false})
    return;
}
