$( document ).ready(function() {
    console.log( "ready!" );
}); 

$( window ).load(function() {
    console.log( "window loaded" );
        $("#answers .answer").each(function(i) {
            var but = $(this);
            this.addEventListener("click", function (e) {
                var target = e.target;
                console.log("target : ");
                console.log(target);
                if (target.value == 'bad') {
                    $(target).addClass('fail');
                    $("#color-info").addClass('red');
                    setTimeout(function() {
                        $(target).removeClass('fail');
                    $("#color-info").removeClass('red');
                    }, 1000);
                    nextQuiz("bad");
                }
                if (target.value == 'good') {
                    console.log(e.target);
                    available_seconds += 5.0;
                    $(target).addClass('success');
                    $("#color-info").addClass('green');
                    setTimeout(function() {
                        $(target).removeClass('success');
                    $("#color-info").removeClass('green');
                    }, 1000);
                    nextQuiz("good");
                }
            });
        });
});

var player;

    
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
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
        $("#answers .answer").each(function(i) {
            console.log("For button " + data['quiz'][i]['title']);
            var but = $(this);
            this.value = data['quiz'][i]['status'];
            but.text(data['quiz'][i]['title']);
            
            player.loadVideoById(id, 15, "large");
            player.playVideo();
        });
    });
    /*
    prevPromise = new Promise(function(resolve, reject) {
        $.getJSON( "/quiz", function( data ) {
            resolve(data);
        });
    }).then(function(data) {
        console.log("Promise data: " + data);
        id = data['trailer'];
        
        $("#answers button").each(function(i) {
            console.log("For button " + data['quiz'][i]['title']);
            var but = $(this);
            this.value = data['quiz'][i]['status'];
            but.text(data['quiz'][i]['title']);
            but.click(function (e) {
                if (e.target.value == 'good') {
                    delete prevPromise;
                    return nextQuiz(event);
                }
            });
            
            event.target.loadVideoById(id, 15, "large");
            event.target.playVideo();
        });
    });
    */
    /*
    $.getJSON( "/quiz", function( data ) {
        console.log("lops");
        console.log(data);
        id = data['trailer'];
        
        $("#answers button").each(function(i) {
            console.log("For button " + data['quiz'][i]['title']);
            var but = $(this);
            this.value = data['quiz'][i]['status'];
            but.text(data['quiz'][i]['title']);
            but.click(function (e) {
                if (e.target.value == 'good') {
                    nextQuiz(event);
                }
            });
        });
        
        event.target.loadVideoById(id, 15, "large");
        event.target.playVideo();
    });
    */
}

function onError(event) {
    console.log("Error: " + event);
    console.log(event);
    nextQuiz("error");
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    player = event.target;
    console.log("Sending hello: " + event);
    
    $.getJSON( "/hello", function( data ) {
        gameId = data['gameId'];
        nextQuiz("init");
    });
}

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
            nextQuiz("init");
        }
        /*if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }*/
      }
      function stopVideo() {
        player.stopVideo();
      }