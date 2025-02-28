const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const Crypto=require('crypto');
const { type } = require('os');

const UserAuthSchema=new mongoose.Schema({
        name:{
        type:String,
        required:true
        },
        email:{
            type:String,
            required:[true,'Please Enter Your Email Id'],
            unique:true,
            validate:[validator.isEmail,"Please Enter a Valid Email Id"],
        },
        password:{
            type:String,
            required:[true,'Please Enter Your Password'],
            minlength:8,
            validate:[validator.isLength,{min:8}],
            //select:false
            },
        confirmPassword:{
            type:String,
            required:[true,'Please Confirm Your Password'],
            validate:{
                validator: function (val) {
                    return val === this.password;
                    },
                    message:'Passwords do not match' 
                 }
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        passwordResetToken:String,
        passwordResetTokenExpriere:Date,
        passwordChangedAt:String,
        photo:{
            type:String
            //default:'default.jpg'
        }
});

UserAuthSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    // const salt=await bcrypt.genSalt(10);
    // this.password=await bcrypt.hash(this.password,salt);
    // next();
    this.password=await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;
    next();
});

// UserAuthSchema.methods.comparePasswordInDb = async function (password, passwordInDb) {
//     return await bcrypt.compare(password, passwordInDb);
// };
// UserAuthSchema.methods.generateResetToken=function(){
//     const resetToken = Crypto.randomBytes(32).toString('hex');
//     this.passwordResetToken=Crypto.createHash('sha256').update(resetToken).digest('hex');
//     this.passwordResetExpires=Date.now()+10+60*1000;
//     return resetToken;
// }
const AuthUsers=mongoose.model('AuthUserLogin',UserAuthSchema);
module.exports=AuthUsers;