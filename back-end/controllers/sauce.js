const Sauce=require('../models/sauce');
const fs=require('fs');
const crypto = require("crypto");

//création de la sauce 
exports.createSauce=async(req , res ,next)=>{
    const id = crypto.randomBytes(16).toString("hex");
    //recuperer le corps de la requete
    const sauceObject =await JSON.parse(req.body.sauce);
    //supprimer l'id au cas ou il y'en a
    delete sauceObject._id;
    //creation de la suace
    const sauce=new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    //sauvegarder la sauce dans notre base de données
    try{
        const savedSauce=await sauce.save();
        console.log(savedSauce)
        res.send(savedSauce);
        res.status(200).send({Message:'Sauce créer avec succée'})
    }catch(error){
       res.status(401).send(error)
    }
}

//recuperer toutes les sauces dans notre base de données
exports.getAllSauces=async(req,res,next)=>{
   try{
       const Sauces=await Sauce.find();
       res.send(Sauces);
   }catch(error){
       res.status(401).send(error)
   }
}

//recuperer une sauce dans notre base de données
exports.getOneSauce=async(req,res,next)=>{
    try{
        const OneSauce=await Sauce.findOne({_id:req.params.id});
        res.send(OneSauce);
    }catch(error){
         res.status(401).send(error)
    }
}

//supprimer une sauce
exports.deleteOneSauce=async(req,res,next)=>{
    try{
        //recuperer le corps de la requete
        const object=await Sauce.findOne({_id:req.params.id});
        //recuperer l'image
        let deleteFile=object.imageUrl.split('/images/')[1];
        //supprimer l'image dans le dossier images 
        fs.unlink(`images/${deleteFile}`,(err)=>{
            if (err) throw err
        });
        //supprimer la sauce dans notre base de données
        const removeSauce=await Sauce.deleteOne({_id:req.params.id});
        res.send(removeSauce);
        res.status(200).send({Message:'sauce supprimer avec succée'})  
    }catch(error){
       res.status(401).send(error)
    }
}

//modifier une sauce dans notre base de données
exports.modifyOneSauce=async(req,res,next)=>{
    //si il y'a un fichier traiter l'image sinon traiter simplement l'objet entrant
    const SauceObject=await req.file?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    }:{...req.body};
    try{
        const updateSauce=await Sauce.updateOne({_id:req.params.id},{...SauceObject , _id:req.params.id});
        res.send(updateSauce);
        res.status(200).send({Message:'sauce modifiée'})
    }catch(error){
        res.status(401).send(error)
    }
}

//ajouter like ou dislike
exports.addLike = (req, res, next) => {
    const sauceId=req.params.id;
    //si like==0
    if(req.body.like==0){
        Sauce.findOne({_id:sauceId},(error , result)=>{
            if(error){
                console.log(error)
            }else{
               likeZero(result,req.body.userId);
               res.send({Message:'Avis supprimer'})
            }
        })
    }//verifier si like ==0

    //si like==1
    if(req.body.like==1){
        Sauce.findOne({_id:sauceId},(error , result)=>{
            if(error){
                console.log(error)
            }else{
               likeOne(result,req.body.userId);
               res.send({Message:'like ajouter'})
            }
        })
    }//verifier si like ==1


    //si like==-1
    if(req.body.like==-1){
        Sauce.findOne({_id:sauceId},(error , result)=>{
            if(error){
                console.log(error)
            }else{
               dislikeOne(result,req.body.userId)
               res.send({Message:'dislike ajouter'})
            }
        })
    }//verifier si like ==-1
};


//like==0
function likeZero(result,Id){
    //verifier si userId est dans le tableau des usersLiked
    //si oui le supprimer dans le tableau 
    //diminuer les likes
    for(users of result.usersLiked){
        if(Id==users){
            result.usersLiked.remove(Id);
            result.likes-=1;
            saveResult(result);
        }
    }
    //verifier si userId est dan le tableau des usersDisliked
    //si oui le supprimer dans le tableau 
    //diminuer les dislikes
    for(users of result.usersDisliked){
        if(Id==users){
           result.usersDisliked.remove(Id);
           result.dislikes-=1;
           saveResult(result);
        }
    } 
}


//like==1
function likeOne(result,Id){
    //verifier si userId est dans le tableau des usersDisliked
    //si oui le supprimer dans le tableau 
    //diminuer les dislikes
    if(result.usersDisliked!=null){
        for(users of result.usersDisliked){
            if(Id==users){
               result.usersDisliked.remove(Id);
               result.dislikes-=1;
               saveResult(result);
            }
        }
    }
    result.usersLiked.push(Id)
    result.likes+=1;
    saveResult(result);
}
/****** */

//like==-1
function dislikeOne(result,Id){
    //verifier si userId est dans le tableau des usersLiked
    //si oui le supprimer dans le tableau 
    //diminuer les likes
    if(result.usersLiked!=null){
        for(users of result.usersLiked){
            if(Id==users){
               result.usersLiked.remove(Id);
               result.likes-=1;
               saveResult(result);
            }
        }
    }
    result.usersDisliked.push(Id)
    result.dislikes+=1;
    saveResult(result);
}
/******** */

//sauvegarder les resultats dans la base de données
function saveResult(result){
    result.save((error , updated)=>{
        if(error){
            console.log(error)
        }else{
           console.log('operations réussie')
        }
    })
}
