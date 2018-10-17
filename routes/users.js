const express = require('express');
const db = require('../utils/db/connection');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/register', (req, res) => {
    const body = req.body;
    bcrypt.hash(body.password, 10, (err, hashedPass) => {
        const userDetails = {
            p_username: body.username,
            p_password: hashedPass,
            p_user_type: 10,
            p_altemail: body.altEmail,
            p_return_code: '@return_code',
            p_return_msg: '@return_msg'
        };
        let sql = `Call register_user(?,?,?,?,@return_code,@return_msg);Select @return_code as code, @return_msg as msg;`
        db.query(
            sql,
            [userDetails.p_username,userDetails.p_password,userDetails.p_user_type,userDetails.p_altemail],
            (err, results, fields) => {
                if (err){
                   return res.send(err).status(400);
                }
                //Return the procedure code and msg
                let result = results[1][0];
                let statusCode = result.code === -1 ? 400 : 200;
                return res.status(statusCode).send(result);
                
            })
        
    })

});

router.get('/', (req, res) => {

    db.query('Select * from users', (error, results, fields) => {
        res.send(results);

    })
});


router.post('/login', (req, res) => {
    bcrypt.compare('somePassword', hash, function (err, res) {
        if (res) {
            // Passwords match
        } else {
            // Passwords don't match
        }
    });
});

module.exports = router;