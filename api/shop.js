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
    User.getallitems().then(items => {
        res.locals.items = items;
    })
    .catch(err => {
        console.log('error in shop route main');
        res.redirect('/oops')
    })
    User.findByid(req.session.userId).then(authuser => {
        const user = {id:authuser.id, email : authuser.email, name:authuser.first_name + ' ' + authuser.last_name };
        console.log(user['name']);
        res.status(200).render('shop.html',{user});
    })
    .catch(error => {
        console.log('error in shop route main');
        res.redirect('/oops')
    })
    
})

module.exports = router;