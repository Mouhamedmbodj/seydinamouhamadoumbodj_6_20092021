const Sauce=require('../models/sauce');
const fs=require('fs');


//création de la sauce 
exports.createSauce=async(req , res ,next)=>{
    //recuperer le corps de la requete
    const sauceObject =await JSON.parse(req.body.sauce);
    //supprimer l'id au cas ou il y'en a
    delete sauceObject._id;
    //creation de la suace
    const sauce=new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    //sauvegarder la sauce dans notre base de données
    try{
         const savedSauce=await sauce.save();
         res.send(savedSauce);
         res.status(200).send({Message:'Sauce créer avec succé'})
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