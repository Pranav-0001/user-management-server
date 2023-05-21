const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userDB = require('../Model/userModel')
const jwt = require('jsonwebtoken')


const handleErrors = (err) => {
    let errors = { email: "", password: "" }

    if (err.message === "incorrect email") errors.username = "That username is not registered"
    if (err.message === "incorrect password") errors.password = "Password is incorrect"

    if (err.code === 11000) {
        errors.username = "Username is already registered"
        return errors
    }

    if (err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}


const register = async (req, res, next) => {
    try {
        let { username, password } = req.body
        password =  password ?  await bcrypt.hash(password, 10) :null;
        userDB.insertMany([{ username, password }]).then((data) => {
            res.status(201).json({ user: data.insertedId, created: true })
        }).catch((err)=>{
            console.log("a",handleErrors(err));
            const errors=handleErrors(err)
            res.json({ errors, created: false })
        })
    }
    catch (error) {
       
    }
}

const Login = async (req,res,next)=>{
    try{
        const {username,password} = req.body
        const user=await userDB.findOne({username:username})
        console.log(username);
        if(username===undefined) {
            const errors={username:'username required'}
            res.json({ errors, created: false })
        }
        else if(password===undefined) {
            const errors={username:'Password required'}
            res.json({ errors, created: false })
        }
        else if(user){
            let auth= password ? await bcrypt.compare(password,user.password) : null;
            if(auth){
                const token=jwt.sign({sub:user._id},'Key',{expiresIn:'3d'})
                res.json({login:true,token,user})
            }else{
                const errors=handleErrors({message:"incorrect password"})
                res.json({ errors, created: false })
            }
        }else{
            const errors=handleErrors({message:"incorrect email"})
            res.json({ errors, created: false })
        }
    }catch(error){
        console.log(error);
    }
}
const auth = (req,res,next) =>{
    try{
       let {token}= req.body
       token = token ? JSON.parse(token):null
       if(token){
        const auth=jwt.verify(token.token,'Key')
        const currentTimestamp = Math.floor(Date.now() / 1000); 
        if(auth.exp<currentTimestamp){
            res.json({token:'expired'})
        }else{
            res.json({token:'valid'})
        }
       }else{
        res.json({token:false})
       }
       
    }catch(err){
        console.log(err);
    }
}
const getUsers=async(req,res,next)=>{
    try{
        const users=await userDB.find()
        res.json(users)
    }catch(err){
        console.log(err);
    }
}

const imageUpload= (req,res,next)=>{
    try{
        const {userId}=req.body
        const imgUrl=req.file.filename
        userDB.updateOne({_id:userId},{$set:{
            image:imgUrl
        }}).then(()=>{
            res.json({status:true,imageurl:imgUrl})
        })
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    register,
    Login,
    auth,
    getUsers,
    imageUpload
}