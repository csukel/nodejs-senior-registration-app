const expect = require('expect');
const request = require('supertest');
const db = require('../../utils/db/connection');
const {app} = require('../../app');

const user = {
    username: "test@gmail.com",
    password: "a12345",
    altEmail: "test2@gmail.com"
}

beforeEach((done) => {
    let sql = 'Delete from users where username = ?'
    db.query(sql,user.username,(err,rows)=>{

        done(err);
    });
    
})

describe('POST /api/user/register',()=>{
    it('should create a new user',(done)=>{
        request(app)
            .post('/api/user/register')
            .send(user)
            .expect(200)
            .expect((res)=>{
                expect(res.body.msg).toBe('User has been registered successfully');
                expect(res.body.code).toBe(1);
            })
            .end((err,res)=>{
                if (err){
                    return done(err);
                }
                let sql = 'Select * from users where username = ?';
                db.query(sql,user.username,(err,rows)=>{
                    if (err){
                        done(err);
                    }
                    expect(rows.length).toBe(1);
                    expect(rows[0].password).not.toBe(user.password);
                    done();
                })
                
                //search in db for newly created user
            })
    });
})