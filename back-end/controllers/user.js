const User =require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const user = require('../models/user');

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
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
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