const express=require('express');
const userContoller=require('./../Controller/usersController');
const Protected_Route=require('../Controller/ProtectedRouteController');
const AuthUserController=require('../Controller/AuthUserController')
const router=express.Router();

router.route('/user-aggregate').get(userContoller.getUsers);

router.route('/').get(Protected_Route.Protect,userContoller.getAllUsers)
                .post(Protected_Route.Protect,AuthUserController.restrict("admin")
                                             ,userContoller.createUser)


router.route('/:id').get(Protected_Route.Protect,userContoller.getUser)
                    .patch(Protected_Route.Protect,AuthUserController.restrict("admin"),
                                                   userContoller.updateUser)
                    .delete(Protected_Route.Protect,AuthUserController.restrict("admin"),
                                                    userContoller.deleteUser)
               

module.exports=router;