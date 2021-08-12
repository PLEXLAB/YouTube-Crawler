var express = require('express');
var app = express();


// Socket connection

/* Creates new HTTP server for socket */
var socketServer = require('http').createServer(app);
var io = require('socket.io')(socketServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

/* Listen for socket connection on port 3002 */
socketServer.listen(3002, function () {
    console.log('Socket server listening on : 3002');
});


/* This event will emit when client connects to the socket server */
io.on('connection', function (socket) {

    console.log("A client connected")

    //Get the video id
    socket.on('video_id', function(id){
        console.log(id)

    var spawn = require("child_process").spawn;
    var process = spawn('python3',[ "./script.py",
                            id] );
  
    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function(data) {
        
        //Once the data is ready and consoled by the python program
        socket.emit('demonetized_keywords', data.toString())

    })
})

});