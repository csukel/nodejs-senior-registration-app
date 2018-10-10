const express = require('express');
const db = require('../utils/db/connection');

const router = express.Router();

router.post('/register',(req,res)=>{
    let body = req.body;
    const userDetails = {
        username : body.username,
        email : body.username,
        password : body.password,
        altEmail : body.altEmail,
        userType : 10
    };

});

router.get('/',(req,res)=>{

    db.query('Select * from users',(error,results,fields)=>{
        res.send(results);
        
    })
    // db.end();
});

module.exports = router;