﻿"use strict";

// Defines Hub
var connection = new signalR.HubConnectionBuilder().withUrl("/pollHub").build();

// Opens Connection to Hub
connection.start().catch(function (err) {
    return console.error(err.toString());
});

// When Document loads listen for Question from Host
// When Vote is clicked send Vote to Host
$(document).ready(function () {
    receiveQuestionFromHost();
    receiveIconsFromHost();
    $('#vote').on('click', function () {
        event.preventDefault();
        sendVoteToHost();
    });
})

// Listen for Question from Host
function receiveQuestionFromHost() {
    connection.on("ReceiveQuestion", function (question) {
        $("#questionTitle").html(question);
    });
}

// Listen for Icons from Host
function receiveIconsFromHost(){
    console.log("Receiving Icons");
    connection.on("ReceiveIconId", function (icon1, icon2) {
        $('#answerOne').html(`<input id="${icon1}2" class="answerOne" type="radio" name="myResponse" value="IconId1" />
        <label class="drinkcard-cc ${icon1}" for="${icon1}2"></label>`);
        $('#answerTwo').html(`<input id="${icon2}2" class="answerTwo" type="radio" name="myResponse" value="IconId2" />
        <label class="drinkcard-cc ${icon2}" for="${icon2}2"></label>`);
        console.log(icon1);
        console.log(icon2);
    });
}

// Send Vote to Host
function sendVoteToHost() {
    var username = localStorage.getItem("username");
    // If something is selected
    if ($('input:radio[name=myResponse]').is(':checked')) {
        // Assign Values
        var myResponseId = $('input[name=myResponse]:checked').attr('class');
        var myResponseVal = $('input[name=myResponse]:checked').val();
        console.log(myResponseId);
        console.log(myResponseVal);
        // Broadcast to Host
        connection.invoke("SendMessage", username, myResponseId, myResponseVal).catch(function (err) {
            return console.error(err.toString());
        });
    } else {
        return console.log("No response selected.");
    }
}