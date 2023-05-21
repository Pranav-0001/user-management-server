const express = require('express');
const router = express.Router()
const adminController = require('../Controller/adminController')


router.post('/login',adminController.login)
router.post('/auth',adminController.auth)
router.post('/deleteuser',adminController.deleteuser)

module.exports = router