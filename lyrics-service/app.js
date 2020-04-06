const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')


const DB = process.env.DB_NAME ||"rl"
const HOST_DB = process.env.DB_HOST || "localhost:27017"
const USERNAME_DB= process.env.DB_USERNAME || "rl"
const PASSWORD_DB= process.env.DB_PASSWORD || "rl"

const app = express();

app.use(cors())


const mongoDB = "mongodb://" + USERNAME_DB + ":" + PASSWORD_DB +  "@" + HOST_DB + "/" + DB;

console.log(mongoDB)

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