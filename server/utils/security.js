const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const encryptPass = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hashedPass) => {
            if (err) {
                return reject(err);
            }
            return resolve(hashedPass);
        })
    })
}

const comparePass = ( plaintextPass, encryptedPass ) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plaintextPass, encryptedPass, (err, bMatches) => {
            if (err) {
                return reject(err);
            }
            return resolve(bMatches);
        })
    });
}

const generateAuthTokenForUser = (user) => {
    return token = jwt.sign({
        username: user.username,
        userid: user.userid
    },
        'secret',
        {
            expiresIn: '1h'
        });
}

const verifyAuthTokeForUser = (token)=>{
    return new Promise((resolve,reject)=>{
        try {
            let decoded = jwt.verify(token, 'secret');
            resolve(decoded); 
        }catch(err){
            reject(err);
        }
    })
}

module.exports = {
    encryptPass,
    comparePass,
    generateAuthTokenForUser,
    verifyAuthTokeForUser
}