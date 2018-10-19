const express = require('express');
const userModel = require('../models/users.model');
const { authenticate } = require('../middleware/authentication');
const router = express.Router();

router.post('/register', async (req, res) => {
    const body = req.body;
    const userDetails = {
        p_username: body.username,
        p_password: body.password,
        p_user_type: 10,
        p_altemail: body.altEmail
    };
    try {
        let result = await userModel.createUser(userDetails);
        let statusCode = result.code === -1 ? 400 : 200;
        return res.status(statusCode).send(result);
    }catch(err){
        return res.status(500).send(err);
    }
});


router.get('/', authenticate, async (req, res) => {
    try {
        let rows = await userModel.getAllUsers();
        return res.json(rows);
    }catch(err){
        return res.status(err.statusCode).send(err);
    }

});


router.post('/login', async (req, res) => {
    let [username, password] = [req.body.username, req.body.password];
    try {
        let token = await userModel.loginUser({ username, password });
        return res.status(200).send({ msg: 'Authenticated succesfully', token });
    }catch(err){
        return res.status(err.statusCode).send(err);
    }
});



module.exports = router;