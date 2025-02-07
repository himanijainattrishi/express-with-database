const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:String,
    password:{
        type:String,
        required:true,
    },


},
{
    timestamps:true, // it will add createdAt and updatedAt fields automatically.
 
}
);

const User=mongoose.model('users', userSchema);
module.exports=User;