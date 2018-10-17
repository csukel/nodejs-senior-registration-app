const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const {authenticate} = require('../middleware/authentication');
const router = express.Router();

router.post('/register', (req, res) => {
    const body = req.body;
    bcrypt.hash(body.password, 10, (err, hashedPass) => {
        const userDetails = {
            p_username: body.username,
            p_password: hashedPass,
            p_user_type: 10,
            p_altemail: body.altEmail
        };
        userModel.createUser(userDetails)
            .then((result) => {
                let statusCode = result.code === -1 ? 400 : 200;
                return res.status(statusCode).send(result);
            })
            .catch((err) => {
                return res.status(500).send('Internal Server Error');
            })

    })

});

router.get('/', authenticate ,(req, res) => {
    userModel.getAllUsers()
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            res.status(err.statusCode).send(err);
        })

});


router.post('/login', (req, res) => {
    let [username, password] = [req.body.username, req.body.password];
    userModel.loginUser({ username, password })
        .then((token) => {
            return res.status(200).send({ msg: 'Authenticated succesfully', token });
        })
        .catch((err) => {
            return res.status(err.statusCode).send(err);
        })
});



module.exports = router;