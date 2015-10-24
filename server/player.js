var Player = function(startx, starty, startz, name, socket) {
    var x = startx,
        y = starty,
        z = startz,
        socket = socket,
        id,
        name = name,
        message = "";

    // getters

    var getX = function() {
        return x;
    }

    var getY = function() {
        return y;
    }

    var getZ = function() {
        return z;
    }

    var getSocket = function() {
        return socket;
    }
    
    var getMessage = function(){
        return message;
    }

    // setters

    var setX = function(value) {
        x = value;
    }

    var setY = function(value) {
        y = value;
    }

    var setZ = function(value) {
        z = value;
    }

    var setSocket = function(socket) {
        socket = socket;
    }

    
    var setMessage = function(value) {
        message = value;
    }

    return {
        getX: getX,
        getY: getY,
        getZ: getZ,
        getMessage: getMessage,
        getSocket: getSocket,
        setX: setX,
        setY: setY,
        setZ: setZ,
        setSocket: setSocket,
        setMessage: setMessage,
        id: id,
        x: x,
        y: y,
        z: z,
        message: message, 
        name : name
    }
};

exports.Player = Player;