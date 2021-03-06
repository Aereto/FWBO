// The following snippet of code before gameStart() is used to set the timer 

$(document).ready(function () {
    $("#startButton").click(function () {
        var sec = 60;

        setInterval(function () {
            if (gamePlaying) {
                document.getElementById("timer").innerHTML = sec;
                sec--;

                if (sec <= 0) {
                    gamePlaying = false;
                    // var rSec = 10;

                    document.getElementById("splashScreen").style.backgroundColor = "#ef4822";
                    $("#hud").hide();
                    $("#hud2").hide();
                    $("#gameTitle").text("Game over!");
                    $("#gameTitle").show();
                    window.clearTimeout(timeOut);
                    //window.location.assign("game_end.html");
                    var gameOverPage = "game_end.php?score=" + score;
                    window.location.assign(gameOverPage);
                    /*
                    $("#startButton").text("Play Again!");
                    $("#startButton").show();
                        
                    */

                    /*

                    // Unused code for setting a time after "Game Over" screen shows up **
                    // This set of code didn't work, but with a little tweaking could probably work **

                    setInterval(function() {
                        document.getElementById("redirect").innerHTML = rSec;
                        rSec--;
                        document.getElementById("redirect").style.display = "initial";

                        if (rSec <= 0) {
                            window.location.assign("http://www.flychicago.com/flywithbutchohare/thankyou.html")
                        }

                    },1000);
                    */

                }
            }
        }, 1000);
    });
});

// Extra Variables for Features
var timeOut;
var gamePlaying = true;
var score = 0;

//gameStart() runs when the startButton is pressed
function gameStart() {
    //Hides background image after starting game
    document.getElementById("splashScreen").style.backgroundImage = "none";

    // Keyboard Constants (separate file?)
    var KEY_ARROW_LEFT = "37";
    var KEY_ARROW_RIGHT = "39";

    // Player Constants
    var ACTION_MOVE = "MOVE";
    var ACTION_IDLE = "IDLE";
    var MAX_SPEED = 30;
    var ACCELERATION = 1;
    var DIRECTION_LEFT = -1;
    var DIRECTION_RIGHT = 1;

    // "Engine" parts
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");

    // Game objects
    var player = new Player();
    var stores = new Stores();
    var scenery = new Scenery();

    var buttons = new ArrowButtons();

    // Snippet requires node.js
    //var fs = require('fs');
    //var files = fs.readdirSync('/images/Storefronts_EAT/');

    function setDebugText(message) {
        document.getElementById("debug").innerHTML = message;
    }

    function fourDigitFormat(n) {
        if (n < 10)
            return "000" + n;
        if (n < 100)
            return "00" + n;
        if (n < 1000)
            return "0" + n;
        return n;
    }

    function initializeImages() {
        // $("document").ready( function (e) 
        // {
        stores.loadImages();
        stores.initStorefronts();
        draw();
        // });
    }
    initializeImages();

    function draw() {
        // update phase
        scenery.update();
        stores.update();
        player.update();

        // render phase
        scenery.draw();
        stores.draw();
        player.draw();
        buttons.draw();

        if (gamePlaying)
            timeOut = setTimeout(draw, 35);
    }

    function ArrowButtons() {
        this.imgLeft = new Image();
        this.imgLeft.src = "images/play_flying/arrow-left.png";

        this.imgRight = new Image();
        this.imgRight.src = "images/play_flying/arrow-right.png";

        this.imgback = new Image();
        this.imgback.src = "images/play_flying/back-button.png";

        var size = 800 / 10;
        var center = 800 / 2;
        var spacing = 800 / 4;
        var y = 480 - size - 10;
        var x = 40;
        var leftX = center - spacing - size / 2;
        var rightX = center + spacing - size / 2;
        var upperleftY = 40;

        this.draw = function () {
            context.drawImage(this.imgLeft, leftX, y, size, size);
            context.drawImage(this.imgRight, rightX, y, size, size);
            context.drawImage(this.imgback, x, upperleftY, size, size);
        }
    }

    function Scenery() {
        this.imgWindow = new Image();
        this.imgFloor = new Array();
        this.floorIndex = 0;
        this.windowScale = 0.75;

        this.imgWindow.src = "images/play_flying/skyline-window_bg.png";

        for (var i = 0; i < 12; i++) {
            this.imgFloor[i] = new Image();
            var n = fourDigitFormat(i);
            this.imgFloor[i].src = "images/play_flying/floor/" + n + ".png";
        }

        this.draw = function () {
            var winWidth = this.imgWindow.width * this.windowScale;
            var winHeight = this.imgWindow.height * this.windowScale;
            var x = canvas.width / 2 - winWidth / 2;
            context.drawImage(this.imgFloor[this.floorIndex], 0, 180);
            context.drawImage(this.imgWindow, x, 0, winWidth, winHeight);
        }

        var delay = 0;
        var rate = 2;
        this.update = function () {
            /* delay++;
             if (delay > rate)
            { */
            this.floorIndex = (this.floorIndex + 1) % this.imgFloor.length;
            delay = 0;
            // }
        }
    }

    function Stores() {
        var store = new Array();

        this.storeFiles = [];
        this.storeImages = [];

        this.initStorefronts = function () {
            if (store.length < 10) {
                store.push(new Storefront());
                setTimeout(this.initStorefronts, 500);
            }
        }

        this.chooseStore = function (store) {
            var r = Math.floor(Math.random() * this.storeImages.length);
            store.imgStore = this.storeImages[r];
        }

        this.sort = function () // TODO: Insert new stores at beginning of array. Don't sort.
        {
            for (var i = 0; i < store.length; i++)
                for (var j = 0; j < store.length - 1; j++) {
                    if (store[j].y > store[j + 1].y) {
                        var temp = store[j];
                        store[j] = store[j + 1];
                        store[j + 1] = temp;
                    }
                }
        }

        this.loadImages = function () {
            for (let i = 0; i < 72; i++) {
                this.storeFiles[i] = `images/play_flying/combined-storefronts/storefront${i+1}.png`;
            }

            for (var i = 0; i < this.storeFiles.length; i++) {
                this.storeImages[i] = new Image();
                this.storeImages[i].src = this.storeFiles[i];
                this.storeImages.onload = function () {
                    setDebugText("Loading " + this.storeFiles[i]);
                }
            }
        }

        this.update = function () {
            for (var i = 0; i < store.length; i++)
                store[i].update();
        }

        this.draw = function () {
            // TODO: Figure out an efficient way to display multiple storefronts simultaneously.		
            for (var i = 0; i < store.length; i++)
                store[i].draw();
        }
    }

    function Storefront() {
        this.x = 250 + Math.random() * 300;
        this.y = 180;
        this.ySpeed = 10;
        this.xSpeed = 0;
        this.scale = 0.01;
        this.imgStore = new Image();
        this.imgStore.src = "images/play_flying/combined-storefronts/storefront1.png";

        this.getWidth = function () {
            return this.imgStore.width * this.scale;
        }

        this.getHeight = function () {
            return this.imgStore.height * this.scale;
        }

        this.draw = function () {
            var w = this.getWidth();
            var h = this.getHeight();

            context.drawImage(this.imgStore, this.x - w / 2, this.y - h, w, h);
        }

        this.update = function () {

            var adjust = 0.5;

            this.y += this.ySpeed;
            this.x += this.xSpeed;
            this.ySpeed *= 1 + (0.08 * adjust); // xSpeed, ySpeed, and scale can be adjusted to slow the approach speed.
            this.scale += 0.016 * adjust;
            if (this.y > canvas.height + this.getHeight() / 2 ||
                this.x < 0 ||
                this.x > canvas.width) {
                if (Math.abs(this.x - player.x) < 100) {
                    score++;
                    setDebugText("Score: " + score);
                    document.getElementById("score").innerHTML = score;
                }
                this.y = 180;
                this.ySpeed = 8;
                this.scale = 0.01;
                this.x = (canvas.width / 2 - 150) + Math.random() * 300;
                this.xSpeed = (this.x - canvas.width / 2) * 0.19;
                stores.chooseStore(this);
                stores.sort();
            }
        }
    }

    function Player() {
        this.action = ACTION_IDLE;
        this.x = 400;
        this.y = 400;
        this.direction = 0;
        var width = 1479 / 5.5; // TODO: Request proper image size.
        var height = 1105 / 5.5;
        //this.score = 0;
        this.speed = 0;
        var imgPlane = new Image();
        imgPlane.src = "images/play_flying/butchairplane_rear.png";

        this.draw = function () {
            context.drawImage(imgPlane, this.x - width / 2, this.y - height / 2, width, height);
        }

        this.update = function () {
            if (this.action == ACTION_IDLE) {
                if (this.speed > ACCELERATION)
                    this.speed -= ACCELERATION;
                else
                    this.speed = 0;
            } else {
                this.speed += ACCELERATION;
                if (this.speed > MAX_SPEED)
                    this.speed = MAX_SPEED;
            }
            this.velocity = this.speed * this.direction
            this.x += this.velocity;

            if (this.x < 0)
                this.x = 0;
            else if (this.x > canvas.width)
                this.x = canvas.width;

        }
    }

    // Touch Events for Mobile
    document.addEventListener('touchstart', touchstart, false);
    document.addEventListener('touchend', touchend, false);

    // Touch Events for Windows 10
    document.onmousedown = mouseDown;
    document.onmouseup = touchend;

    function touchstart(e) {
        var x = e.changedTouches[0].pageX;

        if (x < screen.width / 2) {
            player.action = ACTION_MOVE;
            player.direction = DIRECTION_LEFT;
        } else {
            player.action = ACTION_MOVE;
            player.direction = DIRECTION_RIGHT;
        }

        e.preventDefault();
    }

    function touchend(e) {
        player.action = ACTION_IDLE;
        e.preventDefault();
    }

    function mouseDown(e) {
        //var x = e.clientX;
        var x = e.screenX;
        var y = e.screenY;

        if (x < screen.width / 2 && y < screen.height / 2) {
            window.location.assign("index.html");
            //window.alert("Back button goes here.");
        } else if (y > screen.height / 2) {
            if (x < screen.width / 2) {
                player.action = ACTION_MOVE;
                player.direction = DIRECTION_LEFT;
            } else {
                player.action = ACTION_MOVE;
                player.direction = DIRECTION_RIGHT;
            }
        }
        e.preventDefault();
    }

    document.onkeydown = keyDown;
    document.onkeyup = keyUp;

    function keyDown(e) {

        e = e || window.event;

        // TODO: Does JavaScript have a switch?

        //if (e.keyCode == '38') 
        //{
        // up arrow
        //}
        //else if (e.keyCode == '40') 
        //{
        // down arrow
        //}
        //else
        if (e.keyCode == KEY_ARROW_LEFT) {
            player.action = ACTION_MOVE;
            player.direction = DIRECTION_LEFT;
        } else if (e.keyCode == KEY_ARROW_RIGHT) {
            player.action = ACTION_MOVE;
            player.direction = DIRECTION_RIGHT;
        }
    }

    function keyUp(e) {
        e = e || window.event;
        if (e.keyCode == KEY_ARROW_LEFT ||
            e.keyCode == KEY_ARROW_RIGHT)
            player.action = ACTION_IDLE;
    }
}