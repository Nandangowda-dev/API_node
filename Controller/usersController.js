const Users = require('./../Model/UserModel')
const ApiFeature = require('./../utils/ApiFeatute');
const aSyncError=require('../utils/aSyncErrorHandler');
const customError=require('../utils/ErrorHandler');
exports.getAllUsers = aSyncError(async(req,res,next)=>{
        console.log(req)
        const feature =new ApiFeature(Users.find(),req.query)
        //.Filter()
        .Sort()
        .LimitedFields()
        .Pagination();
        let user= await feature.query;

        res.status(200).json({
            status:'success',
            results:user.length,
            data:{
                user
            }
        })
})
exports.createUser=aSyncError(async(req,res)=>{
        const users= await Users.create(req.body);
        res.status(201).json({
            status:'success',
            results:users.length,
            data:{
                users
            }
        })

})

exports.getUser=aSyncError(async(req,res,next)=>{
     console.log(req.params.id)
    const users=await Users.findById(req.params.id);
    if(!users) {
        const error=new customError("for this Id not mapped any user!",401);
        return next(error);
    }
        res.status(200).json({
            status:'success',
            data:{
                users
            }
        })
});

exports.updateUser=async(req,res)=>{
    try{
        const users=await Users.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
            res.status(200).json({
                status:'success',
                data:{
                    users
                }
            })
    }catch(error){
            res.status(404).json({
                status:"fail",
                message:error.message
            })
    }
}

exports.deleteUser = async(req,res)=>{
    try{
        console.log("users Delete "+req.params.id)
        const users = await Users.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
            message:'User Deleted Successfully..'
        })
    }catch(error){
        res.status(404).json({
            status:"fail",
            message:error.message
        })
    }
}

exports.getUsers=async(req,res)=>{
    try{
        const user=await Users.aggregate([{$match:{age:{$gte:20}}},
                                          {$group:{_id:null,
                                            avgAge:{$avg:'$age'},
                                           // avgSalary:{$avg:'$salary'},
                                            minAge:{$min:'$age'},
                                            maxAge:{$max:'$age'},
                                            //minSalary:{$min:'$salary'},
                                            //maxSalary:{$max:'$salary'}
                                            }
                                        }
                                    ]);
        res.status(200).json({
            status: 'success',
            results:user.length,
            data: {
                user
            }
        })
    }catch(error){
        res.status(400).json({
            status:"fail",
            message:error.message
        })
    }
}


exports.ProfileDetails=aSyncError(async(req,res,next)=>{
    
})