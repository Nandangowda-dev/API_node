const util=require('util');
const jwt = require('jsonwebtoken');
const aSyncError=require('../utils/aSyncErrorHandler');
const customError=require('../utils/ErrorHandler');
const AuthUser=require('../Model/AuthModel');

exports.Protect=aSyncError(async(req,res,next)=>{
    const user_token=req.headers.authorization;
    let token;

    if(user_token && user_token.startsWith('Bearer ')){
        token=user_token.split(' ')[1];
    }

    if(!token){
        const error=new customError("You are not logged in !",401);
        return next(error);
    }

    const validateToken= await util.promisify(jwt.verify)(token,process.env.SECRET_STR);
    console.log(validateToken.id);

    const user=await AuthUser.findById(validateToken.id);

    if(!user){
        const error=new customError("The User with the given token does not exist",401);
        return next(error);
    }

    //const passwordChanged=await AuthUser.isPasswordChanged()
        req.user=user;
        console.log(req.user);
        next();

})