const express = require('express');
const router = express.Router()
const userController=require('../Controller/userController')
const upload = require("../Middlewares/multer")

// ----------- GET ------------

router.get('/getusers',userController.getUsers)


// ----------- POST ------------

router.post('/',userController.auth)
router.post('/register',userController.register)
router.post('/login',userController.Login)
router.post('/profile',upload.single("image"),userController.imageUpload)

module.exports = router