if (process.env.NODE_ENV === 'production') {

    module.exports = {
        mongoURI : 'mongodb://secret:secret@ds241737.mlab.com:41737/jot-prod'
    }
    
}
else {
    module.exports = {
        mongoURI : 'mongodb://localhost:27017/jot-dev'
    }
}
