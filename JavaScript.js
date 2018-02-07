

$(document).ready(function () {
    //main function that gets the json from Wikipedia and then does the animations
    var searchEngaged = false;
    var cleared = false; //true if containerAbs is cleared
    var linkArray = [];//contains the Wikipedia links for each card
    var lastSearchWord;//saves last word searched, avoids searching again for the same word

    //executes the search and appends the cards with search results
    function getResults() {
        if ($("#searchform").val() !== '' && $("#searchform").val() !== lastSearchWord) {
            lastSearchWord = $("#searchform").val();
            //the ajax call - data format is json but the dataType is jsonp to avoid the same source issues with the Wikipedia site
            $.ajax({
                url: 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=' + $('#searchform').val() + '&srnamespace=0&srprop=snippet',
                data: {
                    format: 'json'
                },
                dataType: 'jsonp',
                success: function (data) {
                    var idContainer;
                    var linkAddress;
                    if (!searchEngaged) {
                        $("#removableHeader").remove();
                        $("#footer").remove(); /*these two commands make space for the results sliding up*/
                    }
                    
                    for (var i = 0; i < 10; i++) {
                        idContainer = 'card_' + i;
                        linkAddress = "https://en.wikipedia.org/wiki/" + data.query.search[i].title;
                        if (searchEngaged) {
                            $("#" +idContainer).empty();
                        }
                        $("#containerAbs").append('<div id=' + idContainer + ' onclick="window.open(\'' + linkAddress+'\')"></div>');
                        //the append adds the div wrapped as a link to the container abs
                        $("#"+idContainer).append('<h3 class="titlesResults">' + data.query.search[i].title + ' </h1>').append('<p class="summaryResults">' + data.query.search[i].snippet + ' </p>');                  
                    }
                    appear();
                    searchEngaged = true;
                }

            });
        }
    }
    //removes the group of cards
    //argument is necessary to make sure appear() called in getResults() is called after animation
    //in disappear() has concluded
    function disappear(typeOfSearch) {
        $("#containerAbs").animate({ marginTop: '700px' }, 1000, function () {
            $(this).addClass("invisible");
            if (typeOfSearch) {
                getResults();
            }
        });
        cleared = true;
        
    }
    //reveals the group of cards
    function appear() {
        $("#containerAbs").removeClass("invisible").animate({ marginTop: "55px" });
        cleared = false;
        console.log(lastSearchWord + " appears");
    }

    //this function animates the Wiki icon and creates the input field where search terms are typed
    $("#wikiicon").click(function () {
        $("#wikiicon").animate({ left: '-120px' }, 'slow', function () {
            $("#wikiicon").after('<ul id="inputstuff"><li> <input type="text" id="searchform"/></li ><li><a href="#"><i class="fa fa-search fa-lg" id="searchicon" aria-hidden="true"></i></a></li><li><a href="#"><canvas id="myCanvas" width="16" height="16"></canvas></a></li></ul>');
            setTimeout(function () {
                $("#inputstuff").animate({ width: '225px' }).animate({ height: '33px' }, function () {
                    $("#searchicon").animate({ opacity: '1' });/*makes the search icon visible*/
                    $("#inputstuff").css('padding-top', '4px');/*necessary to align content while allowing the search input to start the animation as a line*/
                    drawX();/* draws the X button*/
                    //bindings for enter key, clear and search icons
                    $("#searchicon").click(function () {
                        console.log($("#searchform").val());
                        console.log(lastSearchWord);
                        if (($("#searchform").val() !== "") && ($("#searchform").val() !== lastSearchWord)) {
                            if (searchEngaged && !cleared) {
                                disappear(true);
                            } else {
                                getResults();
                            }
                        }
                    });

                    $("#searchform").keydown(function (event) {
                        var x = event.which || event.keyCode;
                        if (($("#searchform").val() !== "") && ($("#searchform").val() !== lastSearchWord)) {
                            if (x == 13) {
                                if (searchEngaged && !cleared) {
                                    disappear(true);
                                } else {
                                    getResults();
                                }
                               
                            }
                        }
                    });
                    $("#myCanvas").click(function () {
                        if (searchEngaged && !cleared) {
                            disappear(false);
                        }
                        lastSearchWord = "";
                        $("#searchform").val("");
                    });

                });
            }, 110);
        });
    });

    function drawX() {
        for (var i = 0; i < 9; i++) {
            var timer = i * 50;/*necessary to increase the time to make sure that a line is drawn progressively after each 50ms*/
            drawLine(12, 14, 12 - i, 14 - i, "myCanvas", timer);
            drawLine(12, 6, 12 - i, 6 + i, "myCanvas", timer);
        }
    }

    //the function draws a line from the first two coordinates to the next two on the idString canvas with a delay of timer
    function drawLine(fromX, fromY, toX, toY, idString, timer) {
        var c = document.getElementById(idString);
        var ctx = c.getContext("2d");
        setTimeout(function () {
            ctx.lineWidth = 3;
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
        }, timer);
    }
});