const mongoose=require("mongoose");

const dbconnect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log("connected to database"))
    .catch(()=>console.log("error while connecting databse"))
}

module.exports=dbconnect