const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

const ideas = require('./routes/ideas');
const users = require('./routes/users');

//db config
const db = require('./config/database');

//passport config
require('./config/passport')(passport);


//Map global promise
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect(db.mongoURI,{
    useMongoClient : true
})
.then(() => console.log('Mongodb Connected'))
.catch(err => console.log(err));

//middleware for handlebars
app.engine('handlebars',exphbs({defaultLayout : 'main'}));
app.set('view engine','handlebars');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//set static folder as the public folder
app.use(express.static(path.join(__dirname,'public')));
//method-override middleware
app.use(methodOverride('_method'));
//express session middleware
app.use(session({
    secret: 'xyz',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.get('/',(req, res, next) => res.render('index'));
app.get('/about',(req, res, next) => res.render('about'));

//use routes
app.use('/ideas', ideas);
app.use('/users',users);

const port = process.env.PORT || 5000;
app.listen(port,() => console.log(`Server running on the port: ${port}`));