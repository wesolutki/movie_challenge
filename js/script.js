;(function(){
  function id(v){ return document.getElementById(v); }
  function loadbar() {
    var ovrl = id("overlay"),
        prog = id("progress"),
        stat = id("progstat"),
        img = document.images,
        c = 0,
        tot = img.length;
    if(tot === 0) return doneLoading();

    function imgLoaded(){
      c += 1;
      var perc = ((100/tot*c) << 0) +"%";
      prog.style.width = perc;
      stat.innerHTML = "Loading Movie Challenge "+ perc;
      if(c===tot) return doneLoading();
    }
    function doneLoading(){
      ovrl.style.opacity = 0;
      setTimeout(function(){ 
        ovrl.style.display = "none";
      }, 1200);
    }
    for(var i=0; i<tot; i++) {
      var tImg     = new Image();
      tImg.onload  = imgLoaded;
      tImg.onerror = imgLoaded;
      tImg.src     = img[i].src;
    }    
  }
  document.addEventListener('DOMContentLoaded', loadbar, false);
}());

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
var changing_video = false;

function restartChallenge() {
    console.log("restartChallenge");
    
    $.getJSON( "/hello", function( data ) {
        countdown = $("#countdown");
        countdown.attr('src', "");
        countdown.css("display", "block");
        countdown.attr('src', "img/odliczamy.gif");
        
        available_seconds = 30.0;
        var time_left = $("#time_left");
        time_left.text(displayTime(available_seconds));
        
        setTimeout(function() {
            countdown.css("display", "none");
            
            gameId = data['gameId'];
            nextQuiz("init");
            
            var start_time = getTime();
            if (time_interval) {
                clearInterval(time_interval);
            }
            
            time_interval = setInterval(function(){
                seconds_left = available_seconds - (getTime() - start_time)/1000;
                time_left.text(displayTime(seconds_left));
                if (seconds_left <= 0.0) {
                    stopVideo();
                    clearInterval(time_interval);
                    gameOver();
                }
            }, 100);
            
        }, 3500);
    });
}

function fillScoreList(divName, data) {
    
    upperListDiv = $("#" + divName);
    upperListDiv.empty();
    upperList = data;
    $.each(upperList, function (i) {
        upperListDiv.append('<div class="score">' + '<span class="score_score">' + this[0] + '</span>' + 
                            '<span class="score_nationality">' + this[2] + '</span>' + 
                            '<span class="score_date">' + this[1] + '</span>' + '</div>');
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
        fillScoreList('upper_list', data['upperList']);
        fillScoreList('lower_list', data['lowerList']);
        if (data['upperList'].length === 0) {
            $("#final_result_span").text(data['currentElement'][0] + " YOU ARE THE BEST");
        } else {
            $("#final_result_span").text(data['currentElement'][0]);
        }
    });
}

    
function nextQuiz(resp) {
    $.getJSON( "/quiz/" + gameId + "/" + resp, function( data ) {
        console.log("Next quiz: " + JSON.stringify(data));
        id = data['trailer'];
        lifes_left = data['lifes'];
        $("#multiplier").text('x' + data['multiplayer']);
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
        });  
            
        player.loadVideoById(id, 15, "large");
        player.playVideo();
        
        changing_video = false;
        $(".answer_div").show(500);
    });
}

$( window ).load(function() {
    console.log( "window loaded" );
    
    $('#overlay').fadeOut();
    
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
                if (changing_video) {
                    return;
                }
                changing_video = true;
                $(".answer_div").hide(500);
                var target = e.target;
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
        
    setInterval(function() {
        img_num = parseInt(Math.random() * 8, 10);
        $("#noise").css("top", "-" + (img_num * 100) + "%");
        if (Math.random() >= 0.5) {
            $("#noise").css("transform", "scale(1,-1)");
        }
        if (Math.random() >= 0.5) {
            $("#noise").css("transform", "scale(-1,1)");
        }
    }, 200);
    
    function blinker() {
        result = $("#final_result_span");
        result.fadeOut(500);
        result.fadeIn(500);
    }

    setInterval(blinker, 1000);
});

var player;

      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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