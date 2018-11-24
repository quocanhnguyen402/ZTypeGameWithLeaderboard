var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = process.env.PORT || 6969;
//Create some fake record
var leaderboard = [
    {
        player_name: "Natashi",
        score: 3
    },
    {
        player_name: "Quoc Anh",
        score: 30
    }
];
//Compare function to use in the sort leaderboad
function comapre_leaderboard(obj1, obj2) {
    return obj2.score - obj1.score;
}

//Define the default route
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/ztype_page.html');
});

//Listen to the given port
http.listen(port, function () {
    console.log("Listening on * " + port);
});

//Setup socket server
var io = require('socket.io')(http);

//When have a connection
io.on('connection', function (socket) {
    //Call when the client call socket.emit('get_leaderboard', _);
    socket.on('get_leaderboard', function () {
        //Sort the leaderboad
        leaderboard.sort(comapre_leaderboard);
        //Tell the player to update leaderboard when they submit their score
        socket.emit('update_leaderboard', leaderboard);
    });
    //Call when the client call socket.emit('add_to_leaderboard', _);
    socket.on('add_to_leaderboard', function (object_send) {
        //Push the record to the leaderboard
        leaderboard.push(object_send);
        //Sort the leaderboad
        leaderboard.sort(comapre_leaderboard);
        //Tell the player to update leaderboard when they submit their score
        socket.emit('update_leaderboard', leaderboard);
    });
});