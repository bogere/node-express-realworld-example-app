
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
    
        var category = new Category({
           title: req.body.category,
           description: req.body.description,
           parentCategory: req.body.parentCategory,
           author: user 
        })
    
          category.save(function(err,savedCategory){
             if(err){
              return next(err)
             }
             return res.status(201).send({"message": "successful created..."})
          })
    
      }).catch(next);   
})

//Editing the category
.put(auth.required, function(req,res,next){
   
})




module.exports = router