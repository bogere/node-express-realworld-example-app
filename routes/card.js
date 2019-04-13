var router = require('express').Router()


//yeah this worked perfectly..
router.post('/testing', function(req,res,next){
   var cardId = req.body.cardId
   console.log('hey card', cardId)
   res.json({"success": true, "message": "craeted successful"})
})


module.exports = router
    