const express = require('express');
const { authenticate } = require('../middleware/authentication');
const router = express.Router();
const path    = require("path");

// router.get('/*',(req,res)=>{
//     res.sendFile(path.join(__dirname+'/../../client/login/login.html'));
// })

router.get('/',(req,res)=>{
    res.redirect('/login');
});
router.use('/login', express.static(path.join(__dirname, '/../../client/login')));
router.use('/register', express.static(path.join(__dirname, '/../../client/register')));
router.use('/img',express.static(path.join(__dirname, '/../../client/img')))

module.exports = router;