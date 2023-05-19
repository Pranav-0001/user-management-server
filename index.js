const express= require ('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const userRouter = require('./Routes/user')
const adminRouter = require('./Routes/admin')
const app=express()

app.listen(5000,()=>{
    console.log("connected 5000");
})

app.use(cookieParser())
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/user-management", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connect successfully");
}).catch((error) => {
    console.log(error.message)
})
app.use('/',userRouter)
app.use('/admin',adminRouter)