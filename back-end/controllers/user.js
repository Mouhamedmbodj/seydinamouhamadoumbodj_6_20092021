const User =require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

//création d'un compte utilisateur
exports.signup=async (req , res ,next )=>{
    //hasher le mot de passe de l'utilisateur
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(req.body.password , salt);

    //créer un nouveau utilisateur
    const user=new User({
        email:req.body.email,
        password:hashedPassword,
    }) 

    //sauvegarder l'utilisateur dans notre base de données
    try{
        const savedUser=await user.save();
        res.send(savedUser);
        res.status(200).json({Message:'utilisateur créer!!'})
    }
    catch(error){
        res.status(400).send(error)
    }
}


//connexion utilisateur
exports.login=async (req , res , next)=>{
    //verifier si l'email existe
    const userEmail=await User.findOne({email: req.body.email});
    if(!userEmail){
        return res.status(401).send("Adresse email introuvable, veulliez vous inscrire d'abord")
    }
    //verifier si le mot de passe est correcte
    const userPassword=bcrypt.compare(req.body.password , User.password);
    if(!userPassword){
       return res.status(401).send('Mot de passe invalide')
    }
    
    try{
       console.log('success')
      //assigner un token á l'utilisateur
      const token=jwt.sign({_id:User._id},'RANDOM_TOKEN_SECRET',{expiresIn:'24h'});
      const awaitToken=await token
      //envoyer le token et l'id au frontend
      res.status(200).json({userId:User._id , token:awaitToken})    
    }catch(error){
        res.status(401).send(error)
    }   
}
