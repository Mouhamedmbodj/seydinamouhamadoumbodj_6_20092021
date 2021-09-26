const express=require('express');
const router=express.Router();
const saucesCtrl=require('../controllers/sauce');
const auth=require('../middleware/auth');
const multer=require('../middleware/multer-config');

//ajouter une sauce
router.post('/',auth ,multer,saucesCtrl.createSauce)

//recuperer tout les articles de la base de donnés
router.get('/',auth,saucesCtrl.getAllSauces );
  
//recuperer un article dans la base de données
router.get('/:id',auth,saucesCtrl.getOneSauce );
  
//modifier un article dans la base de donnés
router.put('/:id',auth,multer,saucesCtrl.modifyOneSauce)
  
//supprimer un article dans la base de donnés
router.delete('/:id',auth,saucesCtrl.deleteOneSauce )

//liker ou disliker une sauce
router.post('/:id/like',auth,saucesCtrl.addLike)

module.exports=router;
  