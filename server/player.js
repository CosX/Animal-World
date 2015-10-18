var Player = function(startx, starty, startz, socket) {
    var x = startx,
        y = starty,
        z = startz,
        socket = socket,
        roty = 0,
        id,
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

    var getRotY = function() {
        return roty;
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

    var setRotY = function(value) {
        roty = value;
    }
    
    var setMessage = function(value) {
        message = value;
    }

    return {
        getX: getX,
        getY: getY,
        getZ: getZ,
        getRotY: getRotY,
        getMessage: getMessage,
        getSocket: getSocket,
        setX: setX,
        setY: setY,
        setZ: setZ,
        setRotY: setRotY,
        setSocket: setSocket,
        setMessage: setMessage,
        id: id,
        x: x,
        z: z,
        message: message
    }
};

exports.Player = Player;