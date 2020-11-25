const express = require('express');

const router = express.Router();

const User = require('../models/dbHelper');


const redirectlogin = (req,res,next) => {
    if (!req.session.userId) {
        res.redirect('/signin');
    }
    else{
        next();
    }
}

router.get('/',redirectlogin,(req,res) => {
    const id = req.session.userId;

    User.findByid(id).then(authUser => {
        const user = {id : authUser.id, name : authUser.first_name +' '+ authUser.last_name, email : authUser.email};
        console.log(user['name']);
        res.status(200).render('cart.html',{user});
    })
    .catch(error => {
        console.log('error in cart route main');
        res.redirect('/oops')
    })
    
    
})

module.exports = router;