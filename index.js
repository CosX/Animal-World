var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');
var Player = require('./server/player').Player;

app.listen(3000);

var players = [];
init();
function init() {
    io.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    client.emit("giveid", client.id);
    
    client.emit("allplayers", players);
    
    client.on("disconnect", onClientDisconnect);

    client.on("new animal", onNewPlayer);

    client.on("move animal", onMovePlayer);
    
    client.on("new message", onNewMessage);
    
    
};

function onClientDisconnect() {
    var removePlayer = playerById(this.id);
    console.log(this.id + " disconnected!");
    if(typeof(removePlayer.data) !== "undefined"){
        for (var index = 0; index < players.length; index++) {
            if(players[index].id !== removePlayer.data.id){
                players[index].getSocket().emit("removeplayer", {
                    id: removePlayer.data.id
                });
            }
        }
        players.splice(removePlayer.index, 1);
    }
    
};

function onNewPlayer(data) {
    var newPlayer = new Player(data.x, data.y, data.z, data.name, this);
    newPlayer.id = this.id;

    console.log(this.id + " created");
    players.push(newPlayer);
    
    for (var index = 0; index < players.length; index++) {
        if(players[index].id !== newPlayer.id){
            players[index].getSocket().emit("newplayer", {
                id: newPlayer.id,
                x: newPlayer.x,
                y: newPlayer.y,
                z: newPlayer.z,
                name: newPlayer.name
            });
        }
    }
    
}

function onMovePlayer(data) {
    var player = playerById(this.id);
    if (!player) {
        return;
    };

    player.data.x = data.x;
    player.data.z = data.z;
    player.data.y = data.y;
    
    for (var index = 0; index < players.length; index++) {
        if(players[index].id !== player.data.id){
            players[index].getSocket().emit("move", {
                id: player.data.id,
                x: player.data.x,
                y: player.data.y,
                z: player.data.z
            });
        }
    }
    players[player.index] = player.data;
};

function onNewMessage(data){
     var player = playerById(this.id);

    if (!player) {
        return;
    };
    
    player.data.message = data.message;
    for (var index = 0; index < players.length; index++) {
        if(players[index].id !== player.data.id){
            players[index].getSocket().emit("message", {
                id: player.data.id,
                message: player.data.message,
                name: player.data.name
            });
        }
    }
    players[player.index] = player.data;
};

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return {
                data: players[i],
                index: i
            };
    };

    return false;
};