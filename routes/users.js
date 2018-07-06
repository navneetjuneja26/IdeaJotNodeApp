const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

require('../models/User');
const User = mongoose.model('users');

// Userlogin route
router.get('/login', (req, res, next) => res.render('users/login'));
//User Registration route
router.get('/register', (req, res, next) => res.render('users/register'));

//login form post route
router.post('/login',(req, res, next) => {
    //iife here
    passport.authenticate('local',{
        successRedirect : '/ideas',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req, res, next);
});

//Register form post route

router.post('/register',(req, res, next) => {
    //server side validation
    let errors = [];
    // check if the passwords do not match
    if(req.body.password != req.body.password2){
        errors.push({text : 'Passwords do not match'});
    }
    //check for the length of the password
    if(req.body.password.length < 4){
        errors.push({text : 'Password must be atleast 4 characters'});
    }

    if(errors.length > 0){
        //we are having validation errors
        res.render('users/register',{
          name : req.body.name,
          email : req.body.email,
          password : req.body.password,
          password2 : req.body.password2,
          errors : errors
        });
    }
    else {
       //no errors
        //ensure that you cannot create a new user with 
        // an email that is preexisting with some registered user
        User.findOne({email : req.body.email})
        .then(user => {
            //don't allow creation of new user here
            if(user){
                req.flash('error_msg','Email address already in use.')
                res.redirect('/users/login')
            }else {
                //safe
                const newUser = new User({
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password,
                    password2 : req.body.password2
                });
                // Invoke bcrpt to perform encryption of the password
            bcrypt.genSalt(10,(err,salt) => {
                return bcrypt.hash(newUser.password,salt,(err,hash) => {
                    if(err){
                        throw err;
                    }
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg','You are now registered and can now login');
                        res.redirect('/users/register');
                    })
                    .catch(err => {
                        console.log(err);
                        return;
                    })
        
                })
            })
         
            }
        }) 
    }

});

//user logout route
router.get('/logout',(req, res, next) => {
    req.logout();
    req.flash('success_msg','You are logged out.');
    res.redirect('/users/login');
})

module.exports = router;