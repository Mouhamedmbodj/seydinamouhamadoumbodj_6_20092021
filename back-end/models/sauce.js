const mongoose=require('mongoose');

const sauceSchema=mongoose.Schema({
    name :{type:String,required:true},
    manufacturer:{type:String ,required:true},
    description:{type:String,required:true},
    mainPepper:{type:String,required:true}, 
    imageUrl:{type:String,required:true},
    heat:{type:Number,required:true}, 
    likes:{type:Number,default:0},
    dislikes:{type:Number,default:0},
    usersLiked:[],
    usersDisliked:[], 
})

module.exports=mongoose.model('sauce',sauceSchema)