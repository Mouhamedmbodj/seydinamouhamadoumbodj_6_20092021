const express=require('express');
const app=express();
const mongoose = require('mongoose');
const path=require('path');
require('dotenv/config')

const sauceRoutes=require('./routes/sauce');
const userRoutes=require('./routes/user');


//connecter notre api avec la base de donnees mongo db
mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//debloquer le cors pour qu'il accepte l'appel a l'api   
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//transformer le corps des requetes post en objet json   
app.use(express.json());

//AJOUTER UN CHEMIN STATIC POUR LES IMAGES 
app.use('/images', express.static(path.join(__dirname, 'images')));

//importer les routes
app.use('/api/sauces' , sauceRoutes);
app.use('/api/auth' , userRoutes);

module.exports=app;