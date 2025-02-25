const express=require('express');
const router=express.Router()
const AuthUserController=require('../Controller/AuthUserController')


router.route('/SignUp').post(AuthUserController.Signup);
router.route('/Login').post(AuthUserController.Login);
router.route('/forgotpassword').post(AuthUserController.forgotPassword);
router.route('/resetpassword/:token').patch(AuthUserController.resetPassword);

module.exports=router;