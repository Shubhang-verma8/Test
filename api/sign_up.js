const { json } = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;



const Users = require('../models/dbHelper');

const redirecthome = (req,res,next) => {
    if (req.session.userId) {
        res.redirect('/shop');
    }
    else{
        next();
    }
}


router.get('/',redirecthome,(req,res) => {
    res.status(200).render('sign_up.html');
});


router.post('/',redirecthome,(req,res) => {
    const newUser = req.body;
    Users.findByemail(newUser['email']).then(user => {
        if(user){
            res.status(200).redirect('/signup');
        }
        else{
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(newUser['password'], salt, function(err, hash) {
                    newUser['password'] = hash;
        
                    Users.add(newUser).then(user => {
                        console.log(newUser);
                        res.status(200).redirect('/signin');
                    })
                    .catch(error => {
                        console.log('error in signup route main');
                        res.redirect('/oops')
                    })
                    
                });
            });
        }
    })
    .catch(error => {
        console.log('error in signup route main');
        res.redirect('/oops')
    })
    
});

module.exports = router; 



// Users.add(newUser).then(user => {
//     console.log(newUser);
//     res.status(200).redirect('/signin');
// })
// .catch(error => {
//     res.status(404).send("Something went wrong!!");
// })