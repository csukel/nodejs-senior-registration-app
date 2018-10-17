const userModel = require('../models/user');

const authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    //find user by auth token
    userModel.findUserByAuthToken(token)
        .then((user) => {
            if (!user) {
                //it will execute the catch right down below
                return Promise.reject();
            }
            req.user = user;
            req.token = token;
            next();
        })
        .catch((e) => {
            res.status(401).send();
        })

}

module.exports = {
    authenticate
}