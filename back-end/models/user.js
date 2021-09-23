const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

//création d'un schéma pour verifier 
//les infos poster par l'utilisateur
const userSchema=mongoose.Schema({
    email:{type:String , required:true, unique:true},
    password:{type:String , required:true }
})

userSchema.plugin(uniqueValidator);

//exportation du schema dans nos routes 
module.exports=mongoose.model('User' , userSchema)