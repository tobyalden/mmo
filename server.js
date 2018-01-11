var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Listening on ' + server.address().port);
});

server.lastPlayerID = 0;

io.on('connection', function(socket) {
    socket.on('newplayer', function() {
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(100, 400),
            y: randomInt(100, 400)
        }
        socket.emit('allplayers', getAllPlayers());
        socket.broadcast.emit('newplayer', socket.player);
    });

    socket.on('click', function(data) {
        console.log('click to ' + data.x + ', ' + data.y);
        socket.player.x = data.x;
        socket.player.y = data.y;
        io.emit('move', socket.player);
    });

    socket.on('disconnect', function() {
        io.emit('remove', socket.player.id);
    });
});

function getAllPlayers() {
    var players = []
    Object.keys(io.sockets.connected).forEach(function(socketID) {
        var player = io.sockets.connected[socketID].player;
        if(player) {
            players.push(player);
        }
    });
    return players;
}

function randomInt(floor, ceil) {
    return Math.floor(Math.random() * (ceil - floor) + floor);
}
