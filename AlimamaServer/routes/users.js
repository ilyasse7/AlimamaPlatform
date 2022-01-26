const express = require('express');
const router = express.Router();
var UserController = require('../controllers/AuthentificationController')
var UserMiddleWare = require('../Middleware/middleware.login')


router.get('/:id' ,  UserController.getUserById);
router.post('/adduser', UserController.createUser);
router.post('/login', UserController.authenticateUser);
router.post('/recoverPassWord', UserController.recoverPassword);
router.post('/recoverPassWord/update', UserController.updatePassword);
router.post('/adminConfirmation', UserController.adminConfirmation);
router.post('/activateAccount', UserController.activateAccount);
router.get('/', UserController.getNonConfirmedUsers);


module.exports = router;
