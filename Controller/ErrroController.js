module.exports=(error,req,res,next)=>{
error.statusCode=error.statusCode || 500;
error.message=error.message || 'Internal Server Error';
 res.status(error.statusCode).json({
       status:error.status,
      message:error.message
   });
};
