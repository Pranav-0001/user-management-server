const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const adminDB = require('../Model/adminModel')
const userDB = require('../Model/userModel')
const jwt = require('jsonwebtoken')



const login = async (req, res, next) => {
    try {
        const { username, password } = req.body

        let admin = await adminDB.findOne({ username })
        if (!username) {
            const errors = {}
            errors.username = "Username required"
            res.json({ errors, admin: false })
        }
        else if (!password) {
            const errors = {}
            errors.username = "Password required"
            res.json({ errors, admin: false })
        }
        else if (admin) {
            if (admin.password === password) {
                const token = jwt.sign({ sub: admin._id }, 'Key', { expiresIn: '3d' })
                res.json({ admin: true, token })
            } else {
                const errors = {}
                errors.username = "Incorrect Password"
                res.json({ errors, admin: false })
            }
        } else {
            const errors = {}
            errors.username = "Username is not registered"
            res.json({ errors, admin: false })
        }
    } catch (err) {
        console.log(err);
    }
}
const auth = (req, res, next) => {
    try {
        let { token } = req.body
        token = token ? JSON.parse(token) : null
        if (token) {
            const auth = jwt.verify(token.token, 'Key')
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (auth.exp < currentTimestamp) {
                res.json({ token: 'expired' })
            } else {
                res.json({ token: 'valid' })
            }
        } else {
            res.json({ token: false })
        }

    } catch (err) {
        console.log(err);
    }

}

const deleteuser = (req,res,next) =>{
    
    const {userId}= req.body
    console.log(userId);
    userDB.deleteOne({_id:userId}).then(()=>{
        userDB.find().then(users=>{
            res.json({delete:true,users})
        })
         
    })
   
    
}
const addUser =async(req,res,next)=>{
    try{
        const namereg = /^[^\s][\w\W]+$/gm;
        const passreg = /^[^\s][\w\W]+$/gm;
        const errors={}
        let {username,password}=req.body

        if(!username){
            errors.password="Username required"
            res.json({errors})
        }
        else if(!password){
            errors.password="Password required"
            res.json({errors})
        }
        
        else if(namereg.test(username)==false){
            errors.password="enter a valid username"
            res.json({errors})
        }
        else if(passreg.test(password)==false){
            errors.password="enter a valid password"
            res.json({errors})
        }else{ 
            password=await bcrypt.hash(password, 10)
            userDB.insertMany([{username,password}]).then(()=>{
                res.json({status:true})
            }).catch(err=>{
                console.log(err.code);
                if(err.code==11000){
                    errors.username='username already taken'
                    res.json({errors})
                }
            })
            
        }
    }catch(err){

    }
}
const editUser=(req,res,next)=>{
    try{
        const namereg = /^[^\s][\w\W]+$/gm;
         const {username,id} = req.body
         const errors = {}
        if(username==''){
            errors.username='Enter a username'
            res.json({errors})
        }else if(namereg.test(username)==false){
            errors.username='Enter a valid username'
            res.json({errors})
        }
        else{
            userDB.updateOne({_id:id},{$set:{
            username:username
         }}).then(resu=>{
            console.log(resu);
            res.json({update:true})
         }).catch(err=>{
            if(err.code==11000){
                errors.username='Username already taken'
                res.json({errors})
            }
         })
        }
         
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    login,
    auth,
    deleteuser,
    addUser,
    editUser
}