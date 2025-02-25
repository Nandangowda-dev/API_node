class ApiFeature{
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr;
    }
    Sort(){ 
        if (this.querystr.sort){
            let sortBy =this.querystr.sort.split(',').join(' ');
            console.log("inside if condication  "+sortBy)
            this.query=this.query.sort(sortBy);
        }else{
        this.query=this.query.sort("age");
        console.log( "inside else condition ")
        }
        return this;
    }
    LimitedFields(){
        if(this.querystr.fields){
            const fields=this.querystr.fields.split(',').join(' ');
            this.query=this.query.select(fields)
        }else{
            this.query=this.query.select("-__v");
        }
        return this;
    }
     Pagination (){
        const page=this.querystr.page*1 || 1;
        const limit=this.querystr.limit*1 || 9;
        const skip=(page-1)*limit;
        this.query= this.query.skip(skip).limit(limit);
        return this;
    }
    Filter(){
        let querystring=JSON.stringify(this.querystr);
        querystring=querystring.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        const queryObject=JSON.parse(querystring)

        this.query= this.query.find(queryObject);
        return this;
    }
}

module.exports=ApiFeature;