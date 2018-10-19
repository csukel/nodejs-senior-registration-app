const db = require('../utils/db/connection');
const { encryptPass, comparePass, generateAuthTokenForUser,verifyAuthTokeForUser } = require('../utils/security');

const createUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashedPass = await encryptPass(user.p_password);
            let sql = `Call register_user(?,?,?,?,@return_code,@return_msg);Select @return_code as code, @return_msg as msg;`
            db.query(
                sql,
                [user.p_username, hashedPass, user.p_user_type, user.p_altemail],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        //Return the procedure code and msg
                        let row = rows[1][0];
                        resolve(row);
                    }
                })
        } catch (err) {
            reject(err);
        }

    })

}

const findUserByCredentials = (username) => {
    return new Promise((resolve, reject) => {
        let sql = 'Select userid, username,password from users where username = ?';
        db.query(sql, username, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })

}

const loginUser = ({ username, password }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let genericMsg = 'Please check the provided login credentials. No match found.'
            //search in db for requested user
            let rows = await findUserByCredentials(username);
            if (rows.length === 0) {
                reject({ statusCode: 404, msg: genericMsg });
            } else {
                let user = rows[0];
                let bMatches = await comparePass(password, user.password);
                if (bMatches) {
                    let token = generateAuthTokenForUser(user);
                    //save token into database
                    await saveAuthToken(user.username, token);
                    //return token
                    resolve(token);
                } else reject({ statusCode: 404, msg: genericMsg });
            }
        } catch(err){
            reject({ statusCode: 500, msg: 'Internal Server Error', err })
        }
    })

}


const saveAuthToken = (username, token) => {
    return new Promise((resolve, reject) => {
        let sql = 'Update users set token = ? where username = ?';
        db.query(sql, [token, username], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    })

}

const findUserByAuthToken = (token) => {
    return new Promise( async (resolve, reject) => {
        try {
            let sql = 'Select username from users where userid = ?';
            let decoded = await verifyAuthTokeForUser(token);
            db.query(sql, decoded.userid, (err, rows) => {
                if (err) {
                    reject({ statusCode: 500, err });
                }
                else {
                    if (rows.length === 0) {
                        reject({ statusCode: 401 })
                    } else
                        resolve(rows[0]);
                }
            });
        }catch(err){
            reject(err);
        }


    })
}

const getAllUsers = () => {
    return new Promise((resolve, reject) => [
        db.query('Select * from users', (err, rows) => {
            if (err) {
                reject({ statusCode: 500 });
            }
            resolve(rows);

        })
    ])
}

module.exports = {
    createUser,
    loginUser,
    findUserByAuthToken,
    getAllUsers
}