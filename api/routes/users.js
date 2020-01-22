const express = require('express');
const router = express.Router();

//USING user.js model
//Import mongoose
const mongoose = require('mongoose');
//....................................

//import bcryptjs password hasher
const bcrypt = require('bcryptjs');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
//....................................

//import the user model schema here
const User = require('../model/user');

//import the user "json web token"
const jwt = require('jsonwebtoken');




//Creating signup and login routes
//Signup routes
router.post('/signup', (req, res, next) => {

    // User.find({email: req.body.email}).exec().then(/*Ckeck if user exists here*/).catch()    .....to avoid data duplication
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'User already exists!!!'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {       // "npm install bcrypt --save" to encrypt password.....check "https://www.npmjs.com/package/bcrypt" for documentation
                    //if error exists in the password    
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        //if no error, create a new user
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            address: req.body.address,
                            phone: req.body.phone,
                            email: req.body.email,
                            password: hash
                        });
                        //if user is created, save()
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created!'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch()

});


// Login User
router.post('/login', (req, res, next) => {
    // User.find({email: req.body.email}).exec().then(/*Check if user exists here*/).catch()    .....to login user
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user);
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed, email not found!'
                })
            }
            // else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {

                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if (result) {
                    //.........
                    //we use the "json web token" here
                    const token = jwt.sign({
                        //send to the user his/her email and id
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        //Add your KEY here
                        //Make sure you add it into your environment variable i.e nodemon.json file, just like we did for "MONGO_ATLAS_PW"
                        process.env.JWT_KEY,
                        // "secret",

                        //now add the options
                        {
                            // expiry time
                            expiresIn: "1hr"
                        },
                        //the last argument is a callback where we get our token. We can omit it though and make it as a const like i di up this block (line 95 + line 114)
                    )
                    // .........
                    return res.status(200).json({
                        message: 'Login successful',
                        token: token
                    });
                }
            })
            // }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})


router.get('/', (req, res, next) => {
    User.find()
    .then(data => {
        console.log(data);
        res.status(200).json({
            count: data.length,
            users: data
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})


router.delete('/:userId', (req, res, next) => {

    const id = req.params.userId;
    User.remove({
        _id: req.params.userId
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})


// router.delete('/:productid', (req, res, next) =>{

//     const id = req.params.productid;
//     Product.remove({
//         _id : id
//     })
//     .exec().next().catch();
// })


module.exports = router;