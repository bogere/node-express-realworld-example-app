
var router = require('express').Router(),
    mongoose = require('mongoose')
    Category = mongoose.model('Category'),
    User = mongoose.model('User'),
     auth = require('../auth');

    //API End points for adding, deleting categories.

// Preload category objects on routes with ':category'
router.param('category', function(req, res, next) {
    Category.findOne({ title: req.params.category})
          .then(function (category) {
            if (!category) { return res.sendStatus(404); }
      
            req.category = category;
      
            return next();
          }).catch(next);
      });


router.route('/')

//listing all the categories...
.get(auth.optional, function(req,res,next){
   Category.find({}, function(err,results){
       if(err){
           return next(err)
       }
       //no error.
       return res.status(200).send({"categories": results})
   })
})

//Adding the category.
.post(auth.required, function(req,res,next){
    User.findById(req.payload.id).then(function(user){
        if (!user) { return res.sendStatus(401); }
    
        /*var category = new Category({
           title: req.body.category,
           description: req.body.description,
           parentCategory: req.body.parentCategory,
           author: user 
        })*/
        var category = new Category(req.body.category)
    
          category.save(function(err,savedCategory){
             if(err){
              return next(err)
             }
             console.log('hey added',savedCategory)
             //return res.status(201).send({"message": "successful created..."})
             return res.json({category: savedCategory})
          })
    
      }).catch(next);   
})

//Editing the category
router.put('/:category', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
      if(req.article.author._id.toString() === req.payload.id.toString()){
        if(typeof req.body.category.title !== 'undefined'){
          req.category.title = req.body.category.title;
        }
  
        if(typeof req.body.category.description !== 'undefined'){
          req.category.description = req.body.category.description;
        }
  
        if(typeof req.body.category.parentCategory !== 'undefined'){
          req.category.body = req.body.category.parentCategory;
        }
  
        req.category.save(function(err,updatedCategory){
           res.json({"message": "successful updated the category"})
        })
      } else {
        return res.sendStatus(403);
      }
    });
  });
  

  //Deleting the category..
router.delete('/:category', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
      if (!user) { return res.sendStatus(401); }
  
      if(req.category.author._id.toString() === req.payload.id.toString()){
        return req.category.remove().then(function(){
          return res.sendStatus(204);
        });
      } else {
        return res.sendStatus(403);
      }
    }).catch(next);
  });
  



module.exports = router