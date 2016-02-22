$( document ).ready(function() {
    console.log( "ready!" );
}); 

function getTime() {
    return new Date().getTime();
}

function displayTime(seconds) {
    return parseFloat(Math.round(seconds * 100) / 100).toFixed(1);
}

var available_seconds = 30.0;
var lifes_left = 5;
var time_interval;

function restartChallenge() {
    console.log("restartChallenge");
    
    console.log("Sending hello: " + event);
    $.getJSON( "/hello", function( data ) {
        gameId = data['gameId'];
        nextQuiz("init");
        
        available_seconds = 30.0;
        var start_time = getTime();
        if (time_interval) {
            clearInterval(time_interval);
        }
        
        var time_left = $("#time_left");
        time_interval = setInterval(function(){
            seconds_left = available_seconds - (getTime() - start_time)/1000;
            time_left.text(displayTime(seconds_left));
            if (seconds_left <= 0.0) {
                stopVideo();
                clearInterval(time_interval);
                gameOver();
            }
        }, 100);
    });
}

function gameOver() {
    stopVideo();
    clearInterval(time_interval);
    lifes_left = 0;
    
    $("#game-over").modal({
        backdrop: 'static'
    });
    
    $.getJSON( "/game_over/" + gameId, function( data ) {
        console.log("Gameover: " + JSON.stringify(data));
    });
}

$( window ).load(function() {
    console.log( "window loaded" );
    
    function centerModal() {
        console.log("centerModal");
        $(this).css('display', 'block');
        var $dialog  = $(this).find(".modal-inside"),
        offset       = ($(window).height() - $dialog.height()) / 2,
        bottomMargin = parseInt($dialog.css('marginBottom'), 10);

        if(offset < bottomMargin) offset = bottomMargin;
        $dialog.css("margin-top", offset);
    }

    $(document).on('show.bs.modal', '.modal', centerModal);
    
    document.getElementById("start-challenge").addEventListener("click", function (e) {
        restartChallenge();
    });
    document.getElementById("once-again").addEventListener("click", function (e) {
        restartChallenge();
    });
    
    $("#main-menu").modal({
        backdrop: 'static'
    });
    
        $("#answers .answer").each(function(i) {
            var but = $(this);
            this.addEventListener("click", function (e) {
                var target = e.target;
                console.log("target : ");
                console.log(target);
                if (target.value == 'bad') {
                    $(target).addClass('fail');
                    $("#color-info").css("background-color", "red");
                    setTimeout(function() {
                        $(target).removeClass('fail');
                        $("#color-info").css("background-color", "transparent");
                    }, 1000);
                    if (lifes_left <= 1) {
                        gameOver();
                    }
                    else {
                        nextQuiz("bad");
                    }
                }
                if (target.value == 'good') {
                    console.log(e.target);
                    available_seconds += 5.0;
                    $(target).addClass('success');
                    $("#color-info").css("background-color", "green");
                    setTimeout(function() {
                        $(target).removeClass('success');
                        $("#color-info").css("background-color", "transparent");
                    }, 1000);
                    nextQuiz("good");
                }
            });
        });
        
    
    var counter = 0;
    setInterval(function() {
        img_num = counter%8;
        if (img_num !== 2) {
            console.log(img_num);
            $("#noise").css("top", "-" + (img_num * 100) + "%");
        }
        counter+=1;
    }, 200);
});

var player;

      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('youtube_player', {
          width: '700',
          height: '500',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onError
          }
        });
      }
      

    var gameId = 0;
function nextQuiz(resp) {
    $.getJSON( "/quiz/" + gameId + "/" + resp, function( data ) {
        id = data['trailer'];
        lifes_left = data['lifes'];
        $("#lifes_left img").each(function(i) {
            if (i < lifes_left) {
                $(this).show(1000);
            } else {
                $(this).hide(1000);
            }
        });
        
        $("#answers .answer").each(function(i) {
            console.log("For button " + data['quiz'][i]['title']);
            var but = $(this);
            this.value = data['quiz'][i]['status'];
            but.text(data['quiz'][i]['title']);
            $("#points").text(data['points']);  
            
            player.loadVideoById(id, 15, "large");
            player.playVideo();
        });
    });
}

function onError(event) {
    console.log("Error: " + event);
    console.log(event);
    nextQuiz("error");
}

function onPlayerReady(event) {
    player = event.target;
}

      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
            nextQuiz("init");
        }
      }
      function stopVideo() {
        player.stopVideo();
      }