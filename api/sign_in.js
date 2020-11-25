const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/dbHelper');

const redirecthome = (req,res,next) => {
    if (req.session.userId) {
        res.redirect('/shop');
    }
    else{
        next();
    }
}

router.get('/',redirecthome,(req,res) => {
    res.status(200).render('sign_in.html');
});

router.post('/',redirecthome,(req,res) => {
    const user = req.body;
    User.findByemail(user['name']).then(authUser => {
        if (authUser) {
            bcrypt.compare(user['password'], authUser['password'], function(err, result) {
                if (result == true){
                    req.session.userId = authUser.id;
                    console.log(req.session);
                    return res.status(200).redirect('/shop');
                }
                else{
                    console.log(authUser);
                    res.status(404).redirect('/signin');
                }
            });
        }
        else{
            console.log("either usename or password is wrong");
            res.status(404).redirect('/signup');
        }
    })
    .catch(error => {
        console.log('error in signin route main');
        res.redirect('/oops')
    })
})

module.exports = router;