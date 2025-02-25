const mongoose=require('mongoose');

const usersSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"FirstName is Mandatory"],
        trim:true
    },
    lastName:{
        type:String,
        required:[true,"LastName is Mandatory"],
        trim:true
    },
    age:Number,
    gender:{
        type:String,
        enum:["Male","Female"],
        required:[true,"Gender is Mandatory"]
    },
    email:{
        type:String,
        required:[true,"Email is Mandatory"],
        trim:true,
        unique:[true,"Email already Present"],
        lowercase:true
    },
    CreatedBy:"String",
    CreatedAt:{
        type:Date,
        default:Date.now()
    },
    fatherName:{
        type:String,
        required:[true,"FatherName is Mandatory"],
        trim:true
    }, 
    motherName:{
        type:String,
        required:[true,"MotherName is Mandatory"],
        trim:true
    },
    phoneNumber:{
        type:Number,
        required:[true,"Phone Number is Mandatory"],
    },
    address:{
        type:String,
        required:[true,"Address is Mandatory"],
    }
});
usersSchema.pre('save',function(next){
    this.CreatedBy="Admin"
    next();
})
const Users=mongoose.model('Users',usersSchema);
module.exports=Users;