function getTime() {
    return new Date().getTime();
}

function displayTime(seconds) {
    return parseFloat(Math.round(seconds * 100) / 100).toFixed(1) + "s";
}

var available_seconds = 30.;

$( document ).ready(function() {
    console.log( "ready! time.js");
    var time_left = $("#time_left");
    
    var start_time = getTime();
    var interval = setInterval(function(){
        seconds_left = available_seconds - (getTime() - start_time)/1000;
        time_left.text(displayTime(seconds_left));
        if (seconds_left <= 0.) {
            stopVideo();
            clearInterval(interval);
            time_left.text("Times up");
        }
    }, 100);
});
