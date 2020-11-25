const express = require('express');

const router = express.Router();

const User = require('../models/dbHelper');

router.get('/', (req, res) => {
    try {
        const id = req.session.userId;
        if (id) {
            console.log(`*** ${id} *** about`);
            User.findByid(id).then(authUser => {
                const user = { id: authUser.id, name: authUser.first_name + authUser.last_name, email: authUser.email }
                res.status(200).render('about.html', { user });
            })
        }
        else {
            console.log('no session about');
            res.status(200).render('about.html');
        }
    }
    catch(err){
        res.send('some wrong')
    }
    
})

module.exports = router;