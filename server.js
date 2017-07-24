const express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser');

let port = process.env.PORT || 3000;
const url = "mongodb://zorich_maxim:maxim1101993@ds115573.mlab.com:15573/users-messgaes-db";

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/public/chat-home-page.html')
});

app.use(express.static('public'));
http.listen(port, () => console.log('listen port 3000'));

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('authentication', (user) => {
        MongoClient.connect(url, (err, db) => {
            db.collection("users").find().toArray((err, results) => {
                let userNames = [];
                for (let item of results) {
                    userNames.push(item.name);
                }
                let authentificationState = userNames.indexOf(user.name);
                if (authentificationState == -1) {
                    io.emit('load items', results);
                }
                else {
                    io.emit('name is busy');
                }
            });
        });

    });

    /*
     MongoClient.connect(url, (err, db) => {
     db.collection("users").find().toArray((err, results) => {
     io.emit('load items', results);
     });
     });
     */

    socket.on('disconnect', () => {
        console.log('a user disconnect');
    });

    socket.on('chat msg from client', (msg) => {
        io.emit('chat message from io', msg);
        let msgObject = {};
        [msgObject.msg, msgObject.name] = msg;
        MongoClient.connect(url, (err, db) => {
            db.collection("users").insertOne(msgObject, (err, results) => {
                db.close();
            });
        });
    })
});
