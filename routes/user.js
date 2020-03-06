const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const JWT_KEY = "aassddffgghhjjkkll";

//POST Request for registering user
router.post("/register", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        //check if user field is not empty or null
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Mail exists"
          });
        } else {
          //using bycrypt password of the user can be secured
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                first_name: req.body.first_name,
                email: req.body.email,
                password: hash
              });
              user.save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    message: "User created"
                  });
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
      });
  });

  //POST request for logging in the user
  router.post("/login", (req, res, next) => {
    //Finds the email from the database during logging
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        //check if user field is not empty or null
        if (user.length < 1) {
          return res.status(401).json({
            message: "email does not exist"
          });
        }
        //bcrypt.compare helps in comparing hash password and the password entered by user
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Authentication failed"
            });
          }
          //jwt authentication
          if (result) {
            //token generation
              const token= jwt.sign(
                {   
                    first_name:user[0].first_name,
                    email:user[0].email,
                    userId: user[0]._id
                },
                JWT_KEY,
                {
                    expiresIn: "1h"
                }
              );
              return res.status(200).json({
                message: "Authentication successful",
                token: token
            });
          }
          res.status(401).json({
            message: "password or email incorrect failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

//API for getting user details through jwt tokens
router.get('/profile', function(req, res) {
  //getting token from authorixation header 
  var token = req.headers['authorization'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  //verifying the recieved token
  jwt.verify(token, JWT_KEY, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).json(decoded);
  });
});

module.exports = router;