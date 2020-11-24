const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST + "/" + process.env.DB_NAME, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const Schema = mongoose.Schema;

const LyricsSchema = new Schema({
    name: String,
    lyrics: String
});

const Lyrics = mongoose.model('Lyrics', LyricsSchema);

app.get('/api/lyrics/:lyricsId', (req, res) => {
    console.log("get")
    Lyrics.findOne({ '_id': req.params.lyricsId }, 'name lyrics', function (err, lyric) {
        if (err)
            return console.log(err);

        console.log(lyric)
        return res.send(lyric);
    })
});

app.post('/api/lyrics', (req, res) => {
    Lyrics.create(req.body, function(err, lyrics) {
        if (err)
            return console.log(err);
        
        return res.send(lyrics)
    });
});

app.get('/health', (req, res) => {
    return res.send({status: "UP"});
});

app.listen(8080)