const express = require('express');

const router = express.Router();

const User = require('../models/dbHelper');

const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service : process.env.SERVICE || 'gmail',
    auth : {
        user : process.env.EMAIL || 'vegefoodz.cs19@gmail.com',
        pass : process.env.PASSWORD || '1935shubh1935'
    }
});


const redirectlogin = (req,res,next) => {
    if (!req.session.userId) {
        res.redirect('/signin');
    }
    else{
        next();
    }
}

router.get('/',(req,res) => {
    try{
        const id = req.session.userId;
        if(id){
            console.log(`*** ${id} *** contact`);
            User.findByid(id).then(authUser => {
                const user = {id : authUser.id, name : authUser.first_name + authUser.last_name, email : authUser.email}
                res.status(200).render('contact.html',{user});
            })
        }
        else{
            console.log('no session contact');
            res.status(200).render('contact.html');
        }
    }
    catch(err){
        res.status(500).send("some wrong");
    }
})

router.post('/',redirectlogin , (req,res) => {
    const data = req.body;
    console.log(data);
    var mailOptions = {
        from : 'vegefoodz.cs19@gmail.com',
        to : data['email'],
        subject : data['subject'],
        text : `Thank you very much that you contacted us, we will try to respond to you soon.  Thank you!`
    };
    console.log(data['email']);
    transporter.sendMail(mailOptions , (err , info) => {
        if (err) {
            console.log(err);
        }
        else{
            console.log('Email send : ' + info.response);
        }
    })
    res.status(200).redirect('/contact');
})

module.exports = router;