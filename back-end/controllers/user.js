const User =require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

//joi is joy 
const Joi=require('@hapi/joi');

//models de données attendu 
//pour valider l'utilisateur
const schema = Joi.object({
    email: Joi.string().regex(new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$')).min(8).required().email(),
    password: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{8,32}$')).min(8).required()
});

//création d'un compte utilisateur
exports.signup=async (req , res ,next )=>{
    //valider les données avant de les envoyer dans la base de données
    const validation = schema.validate(req.body);
    //hasher le mot de passe de l'utilisateur
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(validation.value.password , salt);
    //verifier si l'email ou le mot de passe est correcte
    if(validation.error){
        res.status(401).send({message:'email ou mot de passe invalide'});
    }else{
       //créer un nouveau utilisateur
       const user=new User({
          email:validation.value.email,
          password:hashedPassword,
        }) 

        //sauvegarder l'utilisateur dans notre base de données
        try{
          const savedUser=await user.save();
          res.send(savedUser);
          res.status(200).json({message:'Compte créer avec succés'})
        }
        catch(error){ 
          res.status(401).send({message:"Cet email existe déja"});  
        }
    } 
}

//connexion utilisateur
exports.login=async (req , res , next)=>{
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({error:'Utilisateur non trouvé ou Mot de passe incorrect!' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({error:'Utilisateur non trouvé ou Mot de passe incorrect!'});
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                  {userId:user._id},
                  'RANDOM_TOKEN_SECRET',
                  {expiresIn:'24h'}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};