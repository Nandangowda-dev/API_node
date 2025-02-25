const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const Crypto=require('crypto');
const { format } = require('date-fns');
const customError=require('../utils/ErrorHandler');

exports.signToken=(userid)=>{
return jwt.sign({id:userid},process.env.SECRET_STR,{expiresIn:process.env.LOGIN_EXPIRES});
};

exports.comparePasswordInDb= async(password, passwordInDb)=>{
    return await bcrypt.compare(password, passwordInDb);
};


exports.generateResetToken = () => {
    const resetToken = Crypto.randomBytes(32).toString('hex');
    const hashedToken = Crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = Date.now() + 5 * 60 * 1000; 
    return [resetToken,hashedToken,resetExpires];
};

exports.dateFormate=(date)=>{
const formattedDate = format(new Date(date), 'dd-MM-yyyy HH:mm:ss');
console.log(formattedDate);
}