const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

app.use(cors())

const mongoDB = "mongodb://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD +  "@" + process.env.DB_HOST + "/" + process.env.DB_NAME;

var connectWithRetry = function() {
    return mongoose.connect(mongoDB, function(err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        }
    });
};

connectWithRetry();

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var Lyric = new Schema({
    name: String,
    lyric: String
});

var Lyric = mongoose.model('Lyric', Lyric);

app.get('/api/lyric/:lyricId', (req, res) => {
    Lyric.findOne({ '_id': req.params.lyricId }, 'name lyric', function (err, lyric) {
        console.log(err)
        if (err) return handleError(err);
        
        console.log(lyric)
        return res.send(lyric);
    })    
});

app.get('/health', (req, res) => {
    res.send('ok')
})

app.listen("8080", () => {
    console.log("Listening to requests...");
});