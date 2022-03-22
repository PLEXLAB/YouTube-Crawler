var express = require('express');
var app = express();
var cors = require('cors');
const { request } = require('http');

// Socket connection

// app.use(cors())

/* Creates new HTTP server for socket */
var socketServer = require('http').createServer(app);

app.get("/videoData/:video_id", function(req,res){
    var id = req.params.video_id;

    console.log(id)

    var spawn = require("child_process").spawn;
    var process = spawn('python3',[ "./script.py",
                            id] );
  
    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    
    var errorData = "";

    // To handle error case
    process.stderr.on('data', function(data) {
        errorData += data.toString();
    }) 

    var stdData = "";

    // To handle output data
    process.stdout.on('data', function(data) {
        stdData += data.toString();
    })

    process.on("close", function() {
        if(errorData.length > 0)
        {
            res.status(500).send(errorData);
        }
        else
        {
            console.log("Data: " + stdData.toString())
            
            wordsFound = stdData.toString().split("__")
            top_words = wordsFound[0]

            if (top_words.trim() == "Keywords Sheet Not Available" || top_words.trim() == "Not Available"){
                stdData = top_words.trim();
            }

            res.send(stdData.toString());       
        }
    });
    
});


// io.set('origins', 'https://www.youtube.com');


/* Listen for socket connection on port 443 */
socketServer.listen(443, function () {
    console.log('Socket server listening on : 443');
});