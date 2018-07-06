const mongoose = require('mongoose');

//create the idea schema

const ideaSchema = mongoose.Schema({

    title : {
        type : String,
        required : true,
        unique : true
    },

    details : {
        type : String,
        required : true
    },
    user: {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }
});

//create the model for the idea schema
mongoose.model('ideas',ideaSchema);