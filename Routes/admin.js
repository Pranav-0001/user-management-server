const express = require('express');
const router = express.Router()
const adminController = require('../Controller/adminController')


router.post('/login',adminController.login)
router.post('/auth',adminController.auth)
router.post('/deleteuser',adminController.deleteuser)
router.post('/add-user',adminController.addUser)
router.post('/edit-user',adminController.editUser)

module.exports = router