const db = require('../utils/db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = (user) => {
    let sql = `Call register_user(?,?,?,?,@return_code,@return_msg);Select @return_code as code, @return_msg as msg;`
    return new Promise((resolve, reject) => {
        db.query(
            sql,
            [user.p_username, user.p_password, user.p_user_type, user.p_altemail],
            (err, rows) => {
                if (err) {
                    return reject(err);
                }
                else {
                    //Return the procedure code and msg
                    let row = rows[1][0];
                    resolve(row);
                }
            })
    })

}

const findUserByCredentials = (username) => {
    let sql = 'Select userid, username,password from users where username = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, username, (err, rows) => {
            if (err) {
                return reject(err);
            } else {
                resolve(rows);
            }
        })
    })

}

const loginUser = ({ username, password }) => {
    return new Promise((resolve, reject) => {
        findUserByCredentials(username)
            .then((rows) => {
                let genericMsg = 'Please check the provided login credentials. No match found.'
                if (rows.length === 0) {
                    return reject({ statusCode: 404, msg: genericMsg });
                } else {
                    let result = rows[0];
                    bcrypt.compare(password, result.password, (err, bCryptRes) => {
                        if (err) {
                            return reject({ statusCode: 500, msg: 'Internal Server Error',err });
                        }
                        if (bCryptRes) {
                            let token = generateAuthToken(result);
                            //TODO: save token into database
                            saveAuthToken(result.username,token)
                                .then((rows)=>{
                                    return resolve(token);
                                })
                                .catch((err)=>{
                                    return reject({statusCode: 500 , msg:'Internal Server Error',err});
                                })
                            
                        }else {
                            return reject({statusCode:404,msg:genericMsg});
                        }
                    })
                }
            })
            .catch((err) => {
                return reject(err);
            })
    })

}

const generateAuthToken = (result) => {
    return token = jwt.sign({
        username: result.username,
        userid: result.userid
    },
        'secret',
        {
            expiresIn: '1h'
        });
}

const saveAuthToken = (username, token) => {
    return new Promise((resolve,reject)=>{
        let sql = 'Update users set token = ? where username = ?';
        db.query(sql,[token,username],(err,rows)=>{
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    })

}

const findUserByAuthToken = (token) => {
    return new Promise((resolve,reject)=>{
        let sql = 'Select username from users where userid = ?';
        let decoded;
        try {
            decoded = jwt.verify(token, 'secret');
            console.log('Decoded',decoded);
        } catch (e) {
            return Promise.reject({statusCode:401 ,err:e});
        }

        db.query(sql,decoded.userid,(err,rows)=>{
            if (err){
                return reject({statusCode:500,err});
            }
            else {
                if (rows.length === 0){
                    return reject({statusCode:401})
                }else 
                    return resolve(rows[0]);
            }
        });
    })
}

const getAllUsers = ()=>{
    return new Promise((resolve,reject)=>[
        db.query('Select * from users', (err, rows) => {
            if (err){
                return reject({statusCode:500});
            }
            return resolve(rows);
    
        })
    ])
}

module.exports = {
    createUser,
    loginUser,
    findUserByAuthToken,
    getAllUsers
}