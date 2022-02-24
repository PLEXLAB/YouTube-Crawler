var express = require('express');
var app = express();
var cors = require('cors');
const { request } = require('http');

// Socket connection

/* Creates new HTTP server for socket */
var socketServer = require('http').createServer(app);
var io = require('socket.io')(socketServer, 
    {
    cors: {
        origin: ["https://www.youtube.com"]
    }
}
);

// io.set('origins', 'https://www.youtube.com');


/* Listen for socket connection on port 3002 */
socketServer.listen(3002, function () {
    console.log('Socket server listening on : 3002');
});


/* This event will emit when client connects to the socket server */
io.on('connection', function (socket) {

    console.log("A client connected")
    console.log(request.url)

    //Get the video id
    socket.on('video_id', function(id){
        console.log(id)

    var spawn = require("child_process").spawn;
    var process = spawn('python3',[ "./script.py",
                            id] );
  
    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    
    // To handle error case
    process.stderr.on('data', function(data) {
        console.log("error" + data.toString())
    }) 

    // To handle output data
    process.stdout.on('data', function(data) {
        
        console.log("Data" + data.toString())
        
        wordsFound = data.toString().split("__")
        top_words = wordsFound[0]

        if (top_words.trim() == ""){
            data = "";
        }
        socket.emit('demonetized_keywords', data.toString())

    })
})

});