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

const LyricSchema = new Schema({
    name: String,
    lyric: String
});

const Lyric = mongoose.model('Lyric', LyricSchema);

app.get('/api/lyric/:lyricId', (req, res) => {
    Lyric.findOne({ '_id': req.params.lyricId }, 'name lyric', function (err, lyric) {
        if (err)
            return handleError(err);

        return res.send(lyric);
    })
});

app.post('/api/lyric', (req, res) => {
    Lyric.create(req.body, function(err, lyric) {
        if (err)
            return handleError(err);
        
        return res.send(lyric)
    });
});

app.listen(8080)