var config = {
    nodeURL: "http://localhost:3000",
    debug: true,
    getRandomTimeoutInterval: function() {return Math.floor(Math.random() * 15000 + 5000);}
};