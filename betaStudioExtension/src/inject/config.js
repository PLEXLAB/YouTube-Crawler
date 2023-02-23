var config = {
    nodeURL: "http://localhost:3000",
    debug: true,
    getRandomTimeoutInterval: function() {return Math.floor(Math.random() * 3000 + 1000);}
};