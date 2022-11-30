const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");


exports.users_get_all = (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            const Obj = {
                count: docs.length,
                description: "Get All Users",
                user: docs.map(docs => {
                    return {
                        _id: docs._id,
                        email: docs.email,
                        password: docs.password,
                        request: {
                            type: "GET",
                            url: "localhost:2000/users/" + docs._id
                        }
                    }
                })
            }
            res.status(200).json(Obj)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.users_signup_user = (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail Exist, provide another please!"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User Created!!",
                                    require: {
                                        type: "GET",
                                        url: "localhost:2000/users/" + user._id
                                    }
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            })
                    }
                })
            }
        })
}

exports.users_login_user = (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    })
                    return res.status(200).json({
                        message: "Auth Successful!!",
                        token: token
                    })
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.users_delete_user = (req, res, next) => {
    const id = req.params.userId
    User.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                description: "Email is Successfully Deleted!!",
                request: {
                    type: "POST",
                    url: "localhost:2000/users/"
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}