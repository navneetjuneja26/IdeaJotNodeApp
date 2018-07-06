const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
//Load helper

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//idea index page
router.get('/',ensureAuthenticated,(req, res, next) => {
    Idea.find({user : req.user.id})
    .then(ideas => res.render('ideas/index',{ideas : ideas}))
    .catch(err => res.status(500).send(`Some error occured : ${err}`));
});

//add idea form
router.get('/add', ensureAuthenticated, (req, res, next) => res.render('ideas/add'));

//edit idea form
router.get('/edit/:id',ensureAuthenticated,(req, res, next) => {
    Idea.findById(req.params.id)
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg','Not Authorized');
            res.redirect('/ideas');
        }else{
            res.render('ideas/edit',{idea: idea});
        }
    })
    .catch(err => res.status(500).send(err));
})

//POST request to the /ideas route
router.post('/', ensureAuthenticated,(req, res, next) => {
    // res.send('Ok');
    // console.log(req.body.title);
    // console.log(req.body.details);
    let errors = [];
    // check for whether the user entered a title or not
    if(!req.body.title){
        errors.push({text : 'Please provide a title'});
    }
    if(!req.body.details){
        errors.push({text : 'Please provide the details'});
    }
    if(errors.length > 0){
        //re-render the add view along with the errors
        res.render('ideas/add',{title : req.body.title,details : req.body.details,errors : errors});
    }else {
        //no server side errors
        const newUser = {
            title  : req.body.title,
            details : req.body.details,
            user : req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg','New Idea Added');
            res.redirect('/ideas');
        })
        .catch(err => res.status(500).json({err : 'Error occured'}));
    }
});

//Update the idea
router.put('/:id', ensureAuthenticated,(req, res, next) => 
    Idea.findOne({_id : req.params.id})
    .then(idea => {

        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(() => {
            req.flash('success_msg',' Idea Updated');
            res.redirect('/ideas');
        })
        .catch(err => res.status(500).send(`Some error occured : ${err}`));
    })
);

//delete the idea
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
   Idea.remove({_id : req.params.id})
   .then(() => {
        req.flash('success_msg','Idea deleted');
        res.redirect('/ideas')
    });
});



module.exports = router;