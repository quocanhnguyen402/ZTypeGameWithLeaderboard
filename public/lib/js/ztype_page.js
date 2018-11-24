//Create new socket
var socket = io();
//State when start or not
var start = false;

function update_leaderboard(leaderboard) {
    $('#leaderboard').html('');
    for (var index = 0; index < leaderboard.length; index++) {
        var string = "<tr>" +
                "<td>" + leaderboard[index].player_name + "</td>" +
                "<td>" + leaderboard[index].score + "</td>" +
            "</tr>";
        $('#leaderboard').append(string);
    }
}

$(function () {
    //Get the leaderboard from server
    socket.emit('get_leaderboard');
    //When click on submit
    $('#submit_player').on("click", function () {
        //Take the palyer name in the input
        var player_name = $('#player_name').val();
        //Take the player score and add to the object to send
        var object_send = {
            player_name: player_name,
            score: score,
        };
        //Tell the server to add the palyer to the leaderboard
        socket.emit('add_to_leaderboard', object_send);
        //Hide the input
        $('#name_input').hide();
    });
    //When click on start button
    $('#start').on("click", function () {
        start = true;
    });
});

//Called when the server call socket.emit("update_leaderboard")
socket.on('update_leaderboard', function (leaderboard) {
    update_leaderboard(leaderboard);
});