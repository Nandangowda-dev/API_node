const express=require('express');
const router=express.Router();
const path = require('path');
const AuthUserController=require('../Controller/AuthUserController');
const Protected_Route=require('../Controller/ProtectedRouteController');



router.route('/SignUp').post(AuthUserController.Signup);
router.route('/Login').post(AuthUserController.Login);
router.route('/forgotpassword').post(AuthUserController.forgotPassword);
router.route('/resetpassword/:token').patch(AuthUserController.resetPassword);
router.route('/profileUpdate/:id').patch(Protected_Route.Protect,
                                        AuthUserController.uploadUserPhoto,
                                        AuthUserController.imageProcessing,
                                        AuthUserController.updateAuthProfileUser);
//router.route('/pdfstring/:id').get(AuthUserController.AuthProfilepdf);
module.exports=router;