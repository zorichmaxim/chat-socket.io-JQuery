let app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),

    //  http = require('http').createServer(expressApp);
    //  io = require('../..')(http);
    // expressApp = app(),

    port =  process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/chat-home-page.html')
});

//expressApp.use(app.static(__dirname + '/public'));


io.on('connection', socket => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('a user disconnect');
    });

    socket.on('chat msg', (msg) => {
        io.emit('chat message', msg);
    })
 });





http.listen(port, () => console.log('listen port 3000'));
