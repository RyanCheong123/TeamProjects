//--------------------------------------------mini game 1-------------------------------------------//
//--------------------------------------------mini game 1-------------------------------------------//
//--------------------------------------------mini game 1-------------------------------------------//
//--------------------------------------------mini game 1-------------------------------------------//
//--------------------------------------------mini game 1-------------------------------------------//

var bucket;
var background;
var raindrops = [];
var touch = false;
var myScore1;
var collected = 0;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
var gravity = 0.05;
var timer1;
var userName;
var raindropGameStopped = false;
var raindropSound;

window.addEventListener("touchmove", function (event) {
    event.preventDefault();
    event.stopPropagation();
}, false);

//cursor
window.addEventListener("mousemove", mouseMove, false);

function mouseMove(e) {
    gameArea.x = e.pageX;
    //console.log("no");

}
// mobile touch
window.addEventListener('touchstart', touchStart, false);
window.addEventListener('touchmove', touchMove, false)
window.addEventListener('touchend', touchEnd, false);

function touchStart(e) {
    //console.log("touched");
    touch = true;
}

function touchMove(e) {
    if (touch === true && e.touches[0].screenX < gameArea.canvas.width) {
        var touchLocation = e.targetTouches[0];
        gameArea.x = touchLocation.pageX;
        //console.log("what");
    }
}

function touchEnd(e) {
    //console.log("touchend");
    touch = false;
}


function startRaindropGame() {
    gameArea.start();
    bucket = new componentImg(width * 0.1, width * 0.1,
        gameArea.canvas.width / 2 - width * 0.1, gameArea.canvas.height - height * 0.1, "./images/minigame1/bucket.png");
    myScore1 = new componentText(height * 0.05 + "px", "Consolas", "white", 0, height * 0.05, "text");
    timer1 = new componentText(height * 0.05 + "px", "Consolas", "white", width * 0.8, height * 0.05, "text");
    raindropSound = new sound("./audio/waterDropSound.mp3", "effect");
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        gameArea.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height * 0.68;
        // Adds context
        this.context = this.canvas.getContext("2d");
        let div1 = document.getElementById("raindropGame");
        let div2 = document.getElementById("raindropDIV");
        div1.appendChild(this.canvas);
        div2.style.display = "block";
        this.interval = setInterval(updateGameArea, 20);
        this.canvas.style.cursor = "none";
        this.frameNum = 0;
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        //clearInterval(this.interval);
        raindropGameStopped = true;
        $('#next').show(0);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchstart', touchStart);
        window.removeEventListener('touchmove', touchMove)
        window.removeEventListener('touchend', touchEnd);
    }
}

function componentText(fontSize, fontType, color, x, y, text) {
    this.fontSize = fontSize;
    this.fontType = fontType;
    this.x = x;
    this.y = y;
    this.update = function () {
        obj1 = gameArea.context;
        obj1.font = this.fontSize + " " + this.fontType;
        obj1.fillStyle = color;
        obj1.fillText(this.text, this.x, this.y);
    }

}

function componentImg(width, height, x, y, src) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.gravitySpeed = 0;
    this.update = function () {
        obj1 = gameArea.context;
        obj1 = new Image(this.width, this.height);
        obj1.src = src;
        gameArea.context.drawImage(obj1, this.x, this.y, this.width, this.height);

    }
    this.collideWith = function (otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let collide = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            collide = false;
        }
        return collide;
    }

}

function updateGameArea() {
    width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    gameArea.canvas.width = width;
    gameArea.canvas.height = height * 0.68;
    bucket.y = gameArea.canvas.height - bucket.height;
    bucket.width = width * 0.1;
    bucket.height = width * 0.1;
    var x, y;
    for (let i = 0; i < raindrops.length; i++) {
        raindrops[i].width = width * 0.05;
        raindrops[i].height = width * 0.05;
        if (bucket.collideWith(raindrops[i])) {
            raindropSound.stop();
            raindropSound.play();
            collected += 5;
            raindrops.splice(i, 1);
            //console.log(raindrops.length)
            if (collected === 100) {
                gameArea.stop();
            }
        }
    }
    gameArea.clear();

    if (raindropGameStopped === false) {
        gameArea.frameNum += 1;
    }
    // Update background first



    if (gameArea.frameNum === 1 || everyinterval(30)
        && raindropGameStopped === false) {
        x = Math.floor(Math.random() * (gameArea.canvas.width));
        y = 1;
        raindrops.push(new componentImg(width * 0.05, width * 0.05, x, y, "./images/minigame1/raindrop.png"));
    }
    for (let i = 0; i < raindrops.length; i++) {
        if (raindropGameStopped === false) {
            raindrops[i].gravitySpeed += gravity;
            raindrops[i].y += 1 + raindrops[i].gravitySpeed;
        }
        if (raindrops[i].y > gameArea.canvas.height) {
            raindrops.splice(i, 1);
        }
        raindrops[i].update();
    }

    // cursor
    if (gameArea.x) {
        bucket.x = gameArea.x - bucket.width / 2;
    }
    //touch
    if (gameArea.touchX) {
        bucket.x = gameArea.x - bucket.width / 2;
    }
    myScore1.fontSize = width * 0.03 + "px";
    timer1.fontSize = width * 0.03 + "px";
    myScore1.text = "Collected: " + collected + "%";
    timer1.text = "Time: " + (20 - Math.ceil(gameArea.frameNum / 50));
    timer1.x = width * 0.8;
    if ((20 - Math.ceil(gameArea.frameNum / 50) == 0)) {
        gameArea.stop();
    }
    timer1.update();
    myScore1.update();
    bucket.update();
}

function everyinterval(n) {
    if ((gameArea.frameNum / n) % 1 == 0) { return true; }
    return false;
}

//--------------------------------------------Mini Game2--------------------------------------------//
//--------------------------------------------Mini Game2--------------------------------------------//
//--------------------------------------------Mini Game2--------------------------------------------//
//--------------------------------------------Mini Game2--------------------------------------------//
//--------------------------------------------Mini Game2--------------------------------------------//

var sinkFill = 0;
var timer = 20;
var faucetOn = false;
var faucet1On = false;
var faucet2On = false;
var faucet3On = false;
var faucet4On = false;
var faucet5On = false;
var faucet6On = false;
var faucet7On = false;
var faucet8On = false;
var faucet9On = false;
var gameOver = false;

function updateRandomFaucet() {
    var faucets = document.getElementsByClassName("tap");
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    var sinkFill;
    var sinkRunning;
    sinkRunning = new sound("./audio/runningWater.mp3", "effect");
    sinkRunning.play();

    switch (Math.floor((Math.random() * 8))) {
        case 0:
            if (faucet1On == true) {
                ////console.log("Ok carry it thorugh");
            } else {
                faucetOn = true;
                faucet1On = true;
                $("#tap1").attr("src", "./images/minigame2/faucetFrame2.png");
                break;
            }
        case 1:
            if (faucet2On == true) {
                ////console.log("Ok carry it thorugh");
            } else {
                faucetOn = true;
                faucet2On = true;
                $("#tap2").attr("src", "./images/minigame2/faucetFrame2.png");
                break;
            }
        case 2:
            if (faucet3On == true) {
                ////console.log("Ok carry it thorugh");
            } else {
                faucetOn = true;
                faucet3On = true;
                $("#tap3").attr("src", "./images/minigame2/faucetFrame2.png");
                break;
            }
        case 3:
            if (faucet4On == true) {
                ////console.log("Ok carry it thorugh");
            } else {
                faucetOn = true;
                faucet4On = true;
                $("#tap4").attr("src", "./images/minigame2/faucetFrame2.png");
                break;
            }
        case 4:
            if (faucet5On == true) {
                ////console.log("Ok carry it thorugh");
            } else {
                faucetOn = true;
                faucet5On = true;
                $("#tap5").attr("src", "./images/minigame2/faucetFrame2.png");
                break;
            }
        case 5:
            if (faucet6On == true) {
                ////console.log("Ok carry it thorugh");
            } else {
                faucet6On = true;
                faucetOn = true;
                $("#tap6").attr("src", "./images/minigame2/faucetFrame2.png");
                break;
            }
        case 6:
            if (faucet7On == true) {
                ////console.log("Ok carry it thorugh");
            } else {
                faucet7On = true;
                faucetOn = true;
                $("#tap7").attr("src", "./images/minigame2/faucetFrame2.png");
                break;
            }

        case 7:
            if (faucet8On == true) {
                ////console.log("Ok carry it thorugh");
            } else {
                faucet8On = true;
                faucetOn = true;
                $("#tap8").attr("src", "./images/minigame2/faucetFrame2.png");
                break;
            }

        case 8:
            if (faucet9On == true) {
                ////console.log("Ok carry it thorugh");
            } else {
                faucet9On = true;
                faucetOn = true;
                $("#tap9").attr("src", "./images/minigame2/faucetFrame2.png");
                break;
            }


        default:
            faucet1On = true;
            faucet2On = true;
            faucet3On = true;
            faucet4On = true;
            faucet5On = true;
            faucet6On = true;
            faucet7On = true;
            faucet8On = true;
            faucet9On = true;
            for (let i = 0; i < faucets.length; i++) {
                faucets[i].setAttribute("src", "./images/minigame2/faucetFrame2.png");
            }
            break;
    }
    if (sinkFill >= 299 || timer <= 0 || gameOver == true) {
        console.log("adding it??");
        var nextButton = document.createElement("img");
        nextButton.setAttribute("id", "next");
        nextButton.setAttribute("alt", "next");
        nextButton.setAttribute("class", "next");
        nextButton.setAttribute("src", "./images/next.png");
        nextButton.setAttribute("onclick", "nextClick()");
        document.body.appendChild(nextButton);
        sinkRunning.stop();
        removeAllSoundEffects();
        return;
    }
    var rand = Math.floor(Math.random() * (1500 - 500)) + 500;
    setTimeout(updateRandomFaucet, rand);
}

/*  ////////////////////////////////////// */
var sinkFill = 0;

function startSinkFill() {
    setInterval(function () {
        var numFaucetsOn = 0;
        if (faucet1On) {
            numFaucetsOn++;
        }
        if (faucet2On) {
            numFaucetsOn++;
        }
        if (faucet3On) {
            numFaucetsOn++;
        }
        if (faucet4On) {
            numFaucetsOn++;
        }
        if (faucet5On) {
            numFaucetsOn++;
        }
        if (faucet6On) {
            numFaucetsOn++;
        }
        if (faucet7On) {
            numFaucetsOn++;
        }
        if (faucet8On) {
            numFaucetsOn++;
        }
        if (faucet9On) {
            numFaucetsOn++;
        }
        sinkFill = sinkFill + numFaucetsOn;


        if (timer <= 0) {
            gameOver = true;
            return;
        }
        if (sinkFill > 300) {
            gameOver = true;
            $("#text2").html("100%");
            $("#sinkGameWater").css("height", "100%")
            clearInterval(sinkFill);
            return;
        }

        ////console.log(sinkFill);
        $("#sinkGameWater").css("height", Math.ceil(sinkFill / 300 * 100) + "%");
        //placeholder (suppose to be random text)
        $("#text2").html(Math.ceil(sinkFill / 300 * 100) + "%");
        $("#timer").html("Time: " + (timer - 1));


    }, 300);

}

function startTimer() {
    setInterval(function () {
        timer--;

        if (gameOver == true || timer <= 0) {
            gameOver = true;
            clearInterval(timer);
            $('#next').show(0);
            return;
        }
        //console.log(timer)


    }, 1000);
}

function updateTapPage() {
    var taps = document.getElementsByClassName("tap");
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    var tapHeight = height * 0.19;
    var tapWidth = width * 0.19;
    for (let i = 0; i < taps.length; i++) {
        if (width > height) {
            taps[i].style.width = "auto";
            taps[i].style.height = "19vh";
        } else {
            taps[i].style.height = "auto";
            taps[i].style.width = "19%";
        }
    }
    if (width > height) {
        $("#tap2").css("left", (width / 2 - tapHeight / 2) + "px");
        $("#tap5").css("left", (width / 2 - tapHeight / 2) + "px");
        $("#tap8").css("left", (width / 2 - tapHeight / 2) + "px");
    } else {
        $("#tap2").css("left", (width / 2 - tapWidth / 2) + "px");
        $("#tap5").css("left", (width / 2 - tapWidth / 2) + "px");
        $("#tap8").css("left", (width / 2 - tapWidth / 2) + "px");
    }

    setTimeout(updateTapPage, 10);
}


//--------------------------------------------Mini Game3--------------------------------------------//
//--------------------------------------------Mini Game3--------------------------------------------//
//--------------------------------------------Mini Game3--------------------------------------------//
//--------------------------------------------Mini Game3--------------------------------------------//
//--------------------------------------------Mini Game3--------------------------------------------//

var objects = [];
var touch2 = false;
var myScore2;
var collected = 0;
var gravity = 0.05;
var numLives;
var mouseClicked;
var lives = 3;
var score = 0;
var sliceGameMusic;
var sliceGameStopped = false;

var shower = {
    x: Math.random() * width,
    y: height * 0.7,
    width: width * 0.1,
    height: width * 0.1,
    src: "./images/minigame3/shower.png",
    speed: 15,
    score: 100,
    life: 0,
    hitTop: false,
    dropped: -1
};

var faucet = {
    x: Math.random() * width,
    y: height * 0.7,
    width: width * 0.1,
    height: width * 0.1,
    src: "./images/minigame3/faucet.png",
    speed: 15,
    score: 100,
    life: 0,
    hitTop: false,
    dropped: -1
};
var washer = {
    x: Math.random() * width,
    y: height * 0.7,
    width: width * 0.1,
    height: width * 0.1,
    src: "./images/minigame3/washer.png",
    speed: 15,
    score: 100,
    life: 0,
    hitTop: false,
    dropped: -1
};

var waterBottle = {
    x: Math.random() * width,
    y: height * 0.7,
    width: width * 0.1,
    height: height * 0.1,
    src: "./images/minigame3/waterBottle.png",
    speed: 15,
    score: -100,
    life: -1,
    hitTop: false,
    dropped: 0
};

var slicedSound;

window.addEventListener("mousedown", mouseDown2, false);
window.addEventListener("mousemove", mouseMove2, false);
window.addEventListener("mouseup", mouseUp2, false);
window.addEventListener('touchstart', touchStart2, false);
window.addEventListener('touchmove', touchMove2, false)
window.addEventListener('touchend', touchEnd2, false);

function mouseDown2(e) {
    touch2 = true;
}

function mouseMove2(e) {
    if (touch2 === true && e.pageX <= gameArea2.canvas.width
        && e.pageX >= 0 && e.pageY <= gameArea2.canvas.height && e.pageY >= 0) {
        gameArea2.x = e.pageX;
        gameArea2.y = e.pageY;
        //console.log("what");
    } else {
        gameArea2.x = 0;
        gameArea2.y = 0;
    }
}

function mouseUp2(e) {
    //console.log("touchend");
    touch2 = false;
    gameArea2.x = 0;
    gameArea2.y = 0;
}

function touchStart2(e) {
    //console.log("2touched");
    touch2 = true;
}

function touchMove2(e) {
    if (touch2 === true && e.touches[0].screenX < gameArea.canvas.width) {
        var touchLocation = e.targetTouches[0];
        gameArea2.x = touchLocation.pageX;
        gameArea2.y = touchLocation.pageY;
        //console.log("2what");
    } else {
        gameArea2.x = 0;
        gameArea2.y = 0;
    }
}

function touchEnd2(e) {
    //console.log("2touchend");
    touch2 = false;
    gameArea2.x = 0;
    gameArea2.y = 0;
}

function startSliceGame() {
    gameArea2.start();
    //sliceGameMusic = new sound("sliceGame.mp3");
    myScore2 = new componentText2(height * 0.05 + "px", "Consolas", "black", 0, height * 0.05, "text");
    numLives = new componentText2(height * 0.05 + "px", "Consolas", "black", width * 0.8, height * 0.05, "text");
}

var gameArea2 = {
    canvas: document.createElement("canvas"),
    start: function () {
        gameArea2.canvas = document.createElement("canvas");
        gameArea2.canvas.setAttribute("id", "sliceCanvas");
        this.canvas.width = width;
        this.canvas.height = height * 0.68;
        // Adds context
        this.context = this.canvas.getContext("2d");
        let div1 = document.getElementById("sliceGame");
        let div2 = document.getElementById("sliceDIV");
        div1.appendChild(this.canvas);
        div2.style.display = "block";
        this.interval = setInterval(updateGameArea2, 20);
        this.frameNum = 0;
        slicedSound = new sound("./audio/waterDropSound.mp3", "effect");

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        sliceGameStopped = true;
        window.removeEventListener('mousemove', mouseMove2);
        window.removeEventListener('mousedown', mouseDown2);
        window.removeEventListener('mouseup', mouseUp2);
        window.removeEventListener('touchstart', touchStart2);
        window.removeEventListener('touchmove', touchMove2);
        window.removeEventListener('touchend', touchEnd2);

        /*         clearInterval(this.interval);
                window.removeEventListener('mousemove', mouseMove);
                window.removeEventListener('touchstart', touchStart);
                window.removeEventListener('touchmove', touchMove)
                window.removeEventListener('touchend', touchEnd); */
    }
}

function componentText2(fontSize, fontType, color, x, y, text) {
    this.fontSize = fontSize;
    this.fontType = fontType;
    this.x = x;
    this.y = y;
    this.update = function () {
        obj1 = gameArea2.context;
        obj1.font = this.fontSize + " " + this.fontType;
        obj1.fillStyle = color;
        obj1.fillText(this.text, this.x, this.y);
    }

}

function newGameObject(obj) {
    this.width = obj.width;
    this.height = obj.height;
    this.x = obj.x;
    this.y = obj.y;
    this.src = obj.src;
    this.score = obj.score;
    this.life = obj.life;
    this.dropped = obj.dropped;
    this.hitTop = false;
    this.hitLeft = false;
    this.hitRight = false;
    this.speed = height * 0.01;
    this.direction = Math.floor(Math.random() * 2);
    this.update = function () {
        obj1 = gameArea2.context;
        obj1 = new Image(this.width, this.height);
        obj1.src = this.src;
        gameArea2.context.drawImage(obj1, this.x, this.y, this.width, this.height);
    }

    this.sliced = function () {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let collide = false;
        if (gameArea2.x >= myleft && gameArea2.x <= myright
            && gameArea2.y >= mytop && gameArea2.y <= mybottom) {
            collide = true;
        }
        return collide;
        //console.log(collide);
    }

}

function addObjectOntoScreen() {
    let x = Math.floor(Math.random() * (gameArea2.canvas.width));
    let y = 1;
    let randCase = Math.floor(Math.random() * 4);
    switch (randCase) {
        case 0:
            objects.push(new newGameObject(waterBottle));
            objects[objects.length - 1].x = x;
            break;
        case 1:
            objects.push(new newGameObject(washer));
            objects[objects.length - 1].x = x;
            break;
        case 2:
            objects.push(new newGameObject(faucet));
            objects[objects.length - 1].x = x;
            break;
        case 3:
            objects.push(new newGameObject(shower));
            objects[objects.length - 1].x = x;
            break;
        default:
            break;
    }
}

function updateGameArea2() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    gameArea2.canvas.width = width;
    gameArea2.canvas.height = height * 0.68;
    var x, y;

    gameArea2.clear();
    if (sliceGameStopped === false) {
        gameArea2.frameNum += 1;

        var rand = Math.floor(Math.random() * (120 - 50)) + 50;
        if (gameArea2.frameNum === 1 || everyinterval2(rand)) {
            addObjectOntoScreen();
            ////console.log(objects);
        }
        if (everyinterval2(80)) {
            addObjectOntoScreen();
        }
    }

    for (let i = objects.length - 1; i >= 0; i--) {

        objects[i].width = width * 0.1;
        objects[i].height = width * 0.1;

        if (sliceGameStopped === false) {
            if (objects[i].x <= 0) {
                objects[i].x = objects[i].x + 1;
                objects[i].hitLeft = true;
            } else if (objects[i].x >= width - objects[i].width) {
                objects[i].x = objects[i].x - 1;
                objects[i].hitRight = true;
            } else if (objects[i].hitLeft == true) {
                objects[i].x = objects[i].x + 1;
            } else if (objects[i].hitRight == true) {
                objects[i].x = objects[i].x - 1;
            } else {
                switch (objects[i].direction) {
                    case 0:
                        objects[i].x = objects[i].x + 1;
                        break;
                    case 1:
                        objects[i].x = objects[i].x - 1;
                        break;
                    default:
                        break;
                }
            }

            if (objects[i].y <= height * 0.05) {
                objects[i].hitTop = true;
                objects[i].speed = 0;

            }
            if (objects[i].hitTop == true) {
                objects[i].speed += gravity;
                objects[i].y += 1 + objects[i].speed;
                ////console.log(objects[i].speed);
            } else {
                objects[i].speed -= height * 0.0001;
                objects[i].y -= 1 + objects[i].speed;
            }
        }

        objects[i].update();

        if (sliceGameStopped === false) {
            if (objects[i].y >= height * 0.7) {
                lives = lives + objects[i].dropped;
                objects.splice(i, 1);
                ////console.log(objects);
            } else if (objects[i].sliced()) {
                slicedSound.stop();
                slicedSound.play();
                score = score + objects[i].score;
                lives = lives + objects[i].life;
                objects.splice(i, 1);

            }
            if (lives <= 0 || score == 3000) {
                var nextButton = document.createElement("img");
                nextButton.setAttribute("id", "next");
                nextButton.setAttribute("alt", "next");
                nextButton.setAttribute("class", "next");
                nextButton.setAttribute("src", "./images/next.png");
                nextButton.setAttribute("onclick", "nextClick()");
                document.body.appendChild(nextButton);
                gameArea2.stop();
            }
        }
    }

    myScore2.text = "Score: " + score;
    myScore2.fontSize = width * 0.03 + "px";
    numLives.fontSize = width * 0.03 + "px";
    numLives.x = width * 0.8;
    numLives.text = "Lives: " + lives;
    numLives.update();
    myScore2.update();
}

function everyinterval2(n) {
    if ((gameArea2.frameNum / n) % 1 == 0) { return true; }
    return false;
}

//----------------------------------------------story-----------------------------------------------//
//----------------------------------------------story-----------------------------------------------//
//----------------------------------------------story-----------------------------------------------//
//----------------------------------------------story-----------------------------------------------//
//----------------------------------------------story-----------------------------------------------//

var textbox;
var start;
var next;
var textNum = 0;
//  textNum = 230;
var lines = [];
var lines2 = [];
var lines3 = [];
var secondSceneNum = 100;
var thirdSceneNum = 200;
var lastSceneNum = 300;
var employer = "<b>Tommy:<br/></b>";
var questionMark = "<b>???:<br/></b>";
var gardener = "<b>Lily:<br/></b>";
var chef = "<b>Olivia:<br/></b>";
var maintenanceGuy = "<b>Richard:<br/></b>";
var tommy;
var richard;
var lily;
var olivia;
var okClicked = false;
var miniGame1Pass = 0;
var miniGame2Pass = 0;
var miniGame3Pass = 0;

function startStoryGame() {
    storyArea.start();
}

var storyArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        storyArea.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height * 0.68;
        // Adds context
        this.context = this.canvas.getContext("2d");
        let div = document.getElementById("beginningPage");
        div.appendChild(this.canvas);
        this.interval = setInterval(updateStoryArea, 20);
        this.canvas.style.cursor = "none";
        this.frameNum = 0;
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchstart', touchStart);
        window.removeEventListener('touchmove', touchMove)
        window.removeEventListener('touchend', touchEnd);
    }
}

function componentStoryImg(width, height, x, y, src) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.update = function () {
        obj1 = storyArea.context;
        obj1 = new Image(this.width, this.height);
        obj1.src = src;
        storyArea.context.drawImage(obj1, this.x, this.y, this.width, this.height);
    }
}

function updateStoryArea() {
    width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    storyArea.canvas.width = width;
    storyArea.canvas.height = height * 0.68;
    var x, y;
    storyArea.clear();
}

$.ajax({
    url: "./js/transitionPage_gettable.php",
    dataType: "json",
    type: "GET",
    data: { output: 'json' },
    success: function (data) {

        //console.log(data);
        var i = 0;
        var j = 0;
        var x = 0;
        for (i in data.firstscene) {
            lines[i] = data.firstscene[i].dialogue;
        }
        for (j in data.secondscene) {
            lines2[j] = data.secondscene[j].dialogue;
        }
        for (x in data.thirdscene) {
            lines3[x] = data.thirdscene[x].dialogue;
        }
    }
});

function nameCancel() {
    document.getElementById('nameBlank').style.display = 'none';
}

$(document).ready(function () {
    $("#widgetContainer").hide(0);
    $("#kayakButton").click(function () {
        $("#widgetContainer").toggle("blind");
    });

    $('#sinkGameWater').hide(0);
    $('#sinkGame').hide(0);
    $('#beginningPage').hide(0);
    $('#text1').hide(0);
    $('#next').hide(0);
    $('#sliceDIV').hide(0);
    $('#sliceGame').hide(0);
    $('#richard').hide(0);
    $('#tommy').hide(0);
    $('#richardRight').hide(0);
    $('#tommyLeft').hide(0);
    $('#lilyRight').hide(0);
    $('#nozzleIcon').hide(0);
    $('#grassIcon').hide(0);
    $('#springIcon').hide(0);
    $('#broomIcon').hide(0);
    $('#olivia').hide(0);
    $('#rinseIcon').hide(0);
    $('#defrostingIcon').hide(0);
    $('#dishwasherIcon').hide(0);
    $('#washingIcon').hide(0);
    $('#showerIcon').hide(0);
    $('#sound').hide(0);

    //audio variables--------------------------------------------
    //audio variables--------------------------------------------
    //audio variables--------------------------------------------
    //audio variables--------------------------------------------
    //audio variables--------------------------------------------
    
    var backgroundMusicStory;
    backgroundMusicStory = new sound("./audio/startBackgroundMusic.mp3", "backgroundMusic");
    var gardenBackgroundMusic;
    var kitchenBackgroundMusic;
    var hotelBackgroundMusic;
    knockingAudio = new sound("./audio/knock.mp3", "effect");
    sleepingAudio = new sound("./audio/sleeping.mp3", "effect");
    yawnAudio = new sound("./audio/yawn.mp3", "effect");
    elevatorAudio = new sound("./audio/ele.mp3", "effect");
    waterDropAudio = new sound("./audio/badwaterdrop.mp3", "effect");
    waterDropAudio1 = new sound("./audio/badwaterdrop1.mp3", "effect");
    waterDropAudio2 = new sound("./audio/badwaterdrop2.mp3", "effect");
    birds = new sound("./audio/birds.mp3", "effect");
    throatAudio = new sound("./audio/throatclear.mp3", "effect");
    sprinklerAudio = new sound("./audio/sprinkler.mp3", "effect");
    lilyHello = new sound("./audio/hello.mp3", "effect");
    huhAudio = new sound("./audio/huh.mp3", "effect");
    igotit = new sound("./audio/igotit.mp3", "effect");
    lawnmower = new sound("./audio/lawnmower.mp3", "effect");
    walkingAudio = new sound("./audio/walking.mp3", "effect");
    soif = new sound("./audio/soif.mp3", "effect");
    whogoesthere = new sound("./audio/whogoesthere.mp3", "effect");
    leaveAudio = new sound("./audio/leavetoyou.mp3", "effect");
    cmonAudio = new sound("./audio/cmon.mp3", "effect");
    runningWater = new sound("./audio/runningWater.mp3", "effect");
    apologize = new sound("./audio/apologize.mp3", "effect");
    mention = new sound("./audio/mention.mp3", "effect");
    lilyhmm = new sound("./audio/lilyhmm.mp3", "effect");
    isee = new sound("./audio/isee.mp3", "effect");
    wondering = new sound("./audio/wondering.mp3", "effect");
    inotherwords = new sound("./audio/inotherwords.mp3", "effect");
    ontosomething = new sound("./audio/ontosomething.mp3", "effect");
    thats = new sound("./audio/thats.mp3", "effect");
    nothatsnotit = new sound("./audio/nothatsnotit.mp3", "effect");
    thatsit = new sound("./audio/thatsit.mp3", "effect");
    listen = new sound("./audio/listen.mp3", "effect");






  

    //for mini game2---------------------------------------------------------------------------------
    //for mini game2---------------------------------------------------------------------------------
    //for mini game2---------------------------------------------------------------------------------
    //for mini game2---------------------------------------------------------------------------------
    //for mini game2---------------------------------------------------------------------------------
    //for mini game2---------------------------------------------------------------------------------
    //for mini game2---------------------------------------------------------------------------------
    //for mini game2---------------------------------------------------------------------------------

    $("#tap1").click(function () {
        ////console.log("clciked??");
        faucetOn = false;
        faucet1On = false;
        $("#tap1").attr("src", "./images/minigame2/faucet.png");
    });

    $("#tap2").click(function () {
        faucetOn = false;
        faucet2On = false;
        $("#tap2").attr("src", "./images/minigame2/faucet.png");
    });

    $("#tap3").click(function () {
        faucetOn = false;
        faucet3On = false;
        $("#tap3").attr("src", "./images/minigame2/faucet.png");
    });

    $("#tap4").click(function () {
        faucetOn = false;
        faucet4On = false;
        $("#tap4").attr("src", "./images/minigame2/faucet.png");
    });

    $("#tap5").click(function () {
        faucetOn = false;
        faucet5On = false;
        $("#tap5").attr("src", "./images/minigame2/faucet.png");
    });

    $("#tap6").click(function () {
        faucetOn = false;
        faucet6On = false;
        $("#tap6").attr("src", "./images/minigame2/faucet.png");
    });
    $("#tap7").click(function () {
        faucetOn = false;
        faucet7On = false;
        $("#tap7").attr("src", "./images/minigame2/faucet.png");
    });
    $("#tap8").click(function () {
        faucetOn = false;
        faucet8On = false;
        $("#tap8").attr("src", "./images/minigame2/faucet.png");
    });
    $("#tap9").click(function () {
        faucetOn = false;
        faucet9On = false;
        $("#tap9").attr("src", "./images/minigame2/faucet.png");
    });

    //----------------------------------------------------------------------------------------------

    function nameConfirm() {
        userName = document.getElementById('userNameInput').value;
        if (userName.trim().length == 0 || userName.trim().length >= 12) {
            okClicked = false;
            document.getElementById('nameBlank').style.display = 'inline';
        } else if (userName.toUpperCase() === 'BCIT') {
            $.ajax({
                url: "./js/userName_post.php",
                type: "POST",
                async: false,
                data: {
                    "done": 1,
                    "playerName": userName,
                    "miniGame1": miniGame1Pass,
                    "miniGame2": miniGame2Pass,
                    "miniGame3": miniGame3Pass
                },
                success: function(data){
                    console.log(data);
                }
            })
            $('#myModal').remove(0);
            $('#promtBox').remove(0);
            $("promptBoxContent").remove(0);
            $('#sound').show(0);
            backgroundMusicStory.play();
            $('#divID').remove(0);
            $('#easterEggOverlay').animate({
                opacity: 1,
            }, 1000, function () {
            });
            setTimeout(easterEgg, 3000)
        } else {
            $('#sound').show(0);
            $('#myModal').remove(0);
            $('#promtBox').remove(0);
            $("promptBoxContent").remove(0);
            backgroundMusicStory.play();
            $('#overlay').animate({
                opacity: 1,
            }, 1000, function () {
            });
            setTimeout(transitionPage, 2000);
        }
    }


    function transitionPage() {
        $('#divID').remove(0);
        $('#overlay').animate({
            opacity: 0,
        }, 1000, function () { });
        $('#beginningPage').show(0);
        startStoryGame();
        $('#text1').show(0);
        $('#next').show(0);
    }

    function easterEgg() {
        $('#easterEggOverlay').animate({
            opacity: 0,
        }, 500, function () { });
        $('#beginningPage').show(0);
        startStoryGame();
        $('#text1').show(0);
        $('#next').show(0);

    }
    $('#ok').click(function () {
        if (okClicked == false) {
            okClicked = true;
            nameConfirm();
        }
    })
    
    function muteSounds() {
        var allSounds = document.getElementsByTagName("audio");
        soundsMuted = true;
        for(let i = 0; i < allSounds.length; i++) {
            allSounds[i].pause();
        }
    }
    
    function unmuteSounds() {
        var backgroundMusic = document.getElementsByClassName("backgroundMusic");
        soundsMuted = false;
        for(let i = 0; i < backgroundMusic.length; i++) {
            backgroundMusic[0].play();
        }
    }

    var soundMute = false;
    $('#sound').click(function(){
        if (soundMute == false){
            $('#sound').attr("src", "./images/icons/mute.png");
            soundMute = true;
            muteSounds();
        } else {
            $('#sound').attr("src", "./images/icons/sound.png");
            soundMute = false;
            unmuteSounds();
        }
    })

    $("#next").click(function () {
        nextClick();
    });
})

function nextClick() {
    var user = "<b>" + userName + ":<br/></b>";
    var userAlone = userName;
    textNum++;

    console.log(textNum);
    switch (textNum) {
        case 1:
            $("#text1").html(lines[0]);
            knockingAudio.play();
            break;
        case 2:
            knockingAudio.stop();
            sleepingAudio.play();
            backgroundImagePicker("bedroom_blur.png", "bedroom_square_blur.png");
            $("#text1").html(lines[1]);
            break;
        case 3:
            $("#text1").html("<b>Employee:<br/></b>" + lines[2]);
            break;
        case 4:
            sleepingAudio.stop();
            yawnAudio.play();
            $("#text1").html(user + lines[3]);
            break;
        case 5:
            yawnAudio.stop();
            animateDiv();
            backgroundImagePicker("hotel_corridor.jpg", "hotel_corridor_square.jpg");
            $('#tommy').show(0);
            $('#tommy').attr("src", "./images/characters/tommy/tommy1.png");
            $("#text1").html("<b>Employee:<br/></b>" + userName + "! " + lines[4]);
            break;
        case 6:
            $('#tommy').hide(0);
            backgroundImagePicker("bedroom.png", "bedroom_square.png");
            $("#text1").html(user + lines[5]);
            break;
        case 7:
            $('#tommy').show(0);
            $('#tommy').attr("src", "./images/characters/tommy/normalTommy.png");
            backgroundImagePicker("hotel_corridor.jpg", "hotel_corridor_square.jpg");
            $("#text1").html("<b>Employee:<br/></b>" + lines[6]);
            break;
        case 8:
            $('#tommy').attr("src", "./images/characters/tommy/thinkingTommy.png");
            $("#text1").html("<b>Employee:<br/></b>" + lines[7]);
            break;
        case 9:
            cmonAudio.play();
            $('#tommy').attr("src", "./images/characters/tommy/tommy1.png");
            $("#text1").html("<b>Employee:<br/></b>" + lines[8]);
            break;
        case 10:
            cmonAudio.stop();
            $('#tommy').hide(0);
            backgroundImagePicker("bedroom.png", "bedroom_square.png");
            $("#text1").html(user + lines[9]);
            break;
        case 11:
            $('#tommy').show(0);
            backgroundImagePicker("hotel_corridor.jpg", "hotel_corridor_square.jpg");
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $("#text1").html("<b>Employee:<br/></b>" + lines[10]);
            break;
        case 12:
            elevatorAudio.play();
            animateDivSlow();
            backgroundImagePicker("lobby_day.jpg", "lobby_day2.jpg");
            $('#tommy').attr("src", "./images/characters/tommy/normalTommy.png");
            $("#text1").html("<b>Employee:<br/></b>" + lines[11] + " " + userName);
            break;
        case 13:
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $("#text1").html("<b>Employee:<br/></b>" + lines[12]);
            break;
        case 14:
            elevatorAudio.stop();
            $('#tommy').attr("src", "./images/characters/tommy/handTommy.png");
            $("#text1").html(employer + lines[13]);
            break;
        case 15:
            $('#tommy').attr("src", "./images/characters/tommy/normalTommy.png");
            $("#text1").html(employer + lines[14]);
            break;
        case 16:
            $('#tommy').hide(0);
            animateDiv();
            backgroundImagePicker("basement.jpg", "basement_square.png");
            $("#text1").html(employer + lines[15]);
            break;
        case 17:
            $('#tommy').show(0);
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $("#text1").html(employer + lines[16]);
            break;
        case 18:        
            waterDropAudio.play();
            $('#tommy').hide(0);
            $("#text1").html(lines[17]);
            break;
        case 19:
            $('tommy').show(0);
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $("#text1").html(user + lines[18]);
            break;
        case 20:
            waterDropAudio.stop();
            $('#tommy').show(0);
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyClose.png");               
            $("#text1").html(employer + lines[19]);
            break;
        case 21:
            birds.play();
            animateDiv();
            $('#tommy').hide(0);
            backgroundImagePicker("watershed.jpg", "watershed2.jpg");
            $("#text1").html(employer + lines[20]);
            break;
        case 22:
            backgroundImagePicker("stream.png", "stream2.png");
            $("#text1").html(employer + lines[21]);
            break;
        case 23:
            backgroundImagePicker("reservoir.png", "reservoir2.png");
            $("#text1").html(employer + lines[22]);
            break;
        case 24:
            birds.stop();
            $('#tommy').show(0);
            backgroundImagePicker("basement.jpg", "basement_square.png");
            $('#tommy').attr("src", "./images/characters/tommy/normalTommy.png");
            $("#text1").html(employer + lines[23]);
            break;
        case 25:        
            waterDropAudio.play();
            $('#tommy').hide(0);
            $("#text1").html(lines[24]);
            break;
        case 26:
            $("#text1").html(user + lines[25]);
            break;
        case 27:
            waterDropAudio.stop();
            waterDropAudio2.play();
            $("#text1").html(lines[26]);
            break;
        case 28:
            $("#text1").html(user + lines[27]);
            break;
        case 29:         
            waterDropAudio2.stop();
            $('#tommy').attr("src", "./images/characters/tommy/dullTommy.png"); 
            $('#tommy').show(0);
            $("#text1").html(employer + lines[28]);
            break;
        case 30:
            $("#text1").html(user + lines[29]);
            break;
        case 31:
            $('#tommy').attr("src", "./images/characters/tommy/omgTommy.png"); 
            $("#text1").html(employer + lines[30]);
            break;
        case 32:
            $("#text1").html(user + lines[31]);
            break;
        case 33:
            $("#text1").html(user + lines[32]);
            break;
        case 34:                
            $('#tommy').hide(0);
            $("#next").hide(0);
            $('#overlay').animate({
                opacity: 1,
            }, 1500, function () {
            });
            setTimeout(nextMinigame1, 1500);
            break;
        case 35:
            nextEndGame();
            break;
        case (secondSceneNum + 1):
            animateDiv();     
            backgroundImagePicker("basement.jpg", "basement_square.png");
            $('#raindropDIV').remove(0);
            $('#raindropGame').remove(0);
            $('#beginningPage').show(0);
            $('#tommy').show(0);
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png"); 
            igotit.play();
            $("#text1").html(employer + lines2[0]);
            break;
        case 102:
            igotit.stop();
            $('#tommy').attr("src", "./images/characters/tommy/grinTommyHand.png"); 
            $("#text1").html(employer + lines2[1]);
            break;
        case 103:
            $('#tommy').attr("src", "./images/characters/tommy/confidentTommy.png"); 
            $("#text1").html(employer + lines2[2]);
            break;
        case 104:                
            $('#tommy').hide(0);
            $('#richard').show(0);
            $("#text1").html(questionMark + lines2[3]);
            break;
        case 105:
            $("#text1").html(questionMark + lines2[4]);
            break;
        case 106:
            $('#richard').hide(0);
            $("#text1").html(user + lines2[5]);
            break;
        case 107:
            throatAudio.play();
            $('#richard').show(0);
            $('#richard').attr("src", "./images/characters/richard/normalRichard.png");
            $("#text1").html(maintenanceGuy + lines2[6]);
            break;
        case 108:
            throatAudio.stop();
            $('#richard').attr("src", "./images/characters/richard/smileRichard.png");
            $("#text1").html(maintenanceGuy + lines2[7]);
            break;
        case 109:
            $('#richard').attr("src", "./images/characters/richard/smileRichardEye.png");
            $("#text1").html(maintenanceGuy + lines2[8]);
            break;
        case 110:                
            $('#tommy').hide(0); 
            $('#richard').hide(0);
            $('#tommyLeft').attr("src", "./images/characters/tommy/thinkingTommy.png");
            $('#tommyLeft').show(0); 
            $('#richardRight').attr("src", "./images/characters/richard/smileRichardEye.png");
            $('#richardRight').show(0);
            $("#text1").html(employer + lines2[9]);
            break;
        case 111:
            $('#richardRight').attr("src", "./images/characters/richard/mildRichard.png");
            $("#text1").html(maintenanceGuy + lines2[10]);
            break;
        case 112:
            thats.play();
            $('#tommyLeft').attr("src", "./images/characters/tommy/dullTommy.png");
            $("#text1").html(employer + lines2[11]);
            break;
        case 113:
            thats.stop();
            $('#tommyLeft').hide(0); 
            $('#richardRight').hide(0);
            backgroundImagePicker("sunshine.jpg", "sunshine2.jpg");
            $("#text1").html(maintenanceGuy + lines2[12]);
            break;
        case 114: 
            inotherwords.play();
            $("#text1").html(maintenanceGuy + lines2[13]);
            break;
        case 115:
            $('#richard').hide(0);
            backgroundImagePicker("basement.jpg", "basement_square.png");
            $('#tommyLeft').show(0); 
            $('#richardRight').show(0);
            $("#text1").html(user + lines2[14]);
            break;
        case 116:
            inotherwords.stop();
            $("#text1").html(user + lines2[15]);
            break;
        case 117:
            $('#richardRight').hide(0);
            $('#tommyLeft').hide(0);
            backgroundImagePicker("population1.jpg", "population2.jpg");
            $("#text1").html(maintenanceGuy + lines2[16]);
            break;
        case 118:
            $("#text1").html(maintenanceGuy + lines2[17]);
            break;
        case 119:
            $('#tommy').attr("src", "./images/characters/tommy/handTommy.png");             
            $('#tommy').show(0);
            backgroundImagePicker("basement.jpg", "basement_square.png");
            $("#text1").html(employer + lines2[18]);
            break;
        case 120:
            $('#tommy').attr("src", "./images/characters/tommy/concernedTommy.png");             
            $("#text1").html(user + lines2[19]);
            break;
        case 121:
            $("#text1").html(user + lines2[20]);
            break;
        case 122:
            $("#text1").html(user + lines2[21]);
            break;
        case 123:
            ontosomething.play();
            $('#tommy').attr("src", "./images/characters/tommy/thinkingTommy.png");             
            $("#text1").html(employer + lines2[22]);
            break;
        case 124:
            $('#tommy').attr("src", "./images/characters/tommy/grinTommyHand.png");     
            $("#text1").html(employer + lines2[23]);
            break;
        case 125:
            ontosomething.stop();
            $("#text1").html(user + lines2[24]);
            break;
        case 126:
            $('#tommy').hide(0);
            animateDiv();
            removeAllSounds();
            gardenBackgroundMusic = new sound("./audio/gardenscene.mp3", "backgroundMusic");
            gardenBackgroundMusic.play();
            walkingAudio.play();
            backgroundImagePicker("garden_walkway.jpg", "garden_walkway2.jpg");
            $("#text1").html(lines2[25]);
            break;
        case 127:
            walkingAudio.stop();
            sprinklerAudio.play();
            $('#tommy').attr("src", "./images/characters/tommy/concernedTommyMild.png");
            $('#tommy').show(0);
            $("#text1").html(employer + "<i>" + lines2[26] + "</i>");
            break;
        case 128:
            sprinklerAudio.stop();
            animateDiv();
            $('#tommyLeft').attr("src", "./images/characters/tommy/normalTommy.png");
            $('#tommy').hide(0);
            $('#tommyLeft').show(0);
            backgroundImagePicker("garden_pavillion.jpg", "garden_pavillion2.jpg");
            $("#text1").html(employer + lines2[27]);
            break;
        case 129: 
            lilyHello.play();
            $('#lilyRight').show(0);
            $("#text1").html("<b>Gardener:<br/></b>" + lines2[28]);
            break;
        case 130:
            $('#lilyRight').attr("src", "./images/characters/gardener/lily.png");
            $("#text1").html(gardener + lines2[29]);
            break;
        case 131:
            lilyHello.stop();        
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyClose.png");
            $("#text1").html(gardener + lines2[30]);
            break;
        case 132:
            $('#tommyLeft').attr("src", "./images/characters/tommy/tommy1.png");
            $("#text1").html(employer + lines2[31]);
            break;
        case 133:
            $('#lilyRight').attr("src", "./images/characters/gardener/concernedLily.png");
            $("#text1").html(gardener + lines2[32]);
            break;
        case 134:
            $('#tommyLeft').attr("src", "./images/characters/tommy/concernedTommyMild.png");
            $("#text1").html(employer + lines2[33]);
            break;
        case 135:
            $('#tommyLeft').attr("src", "./images/characters/tommy/concernedTommy.png");
            $("#text1").html(employer + lines2[34]);
            break;
        case 136:
            soif.play();
            $('#lilyRight').attr("src", "./images/characters/gardener/helpLily.png");
            $("#text1").html(gardener + lines2[35]);
            break;
        case 137:
            $('#tommyLeft').attr("src", "./images/characters/tommy/normalTommy.png");
            $("#text1").html(employer + lines2[36]);
            break;
        case 138:
            soif.stop();
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyOpenGrass.png");
            $("#text1").html(gardener + lines2[37]);
            break;
        case 139:
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyDownGrass.png");
            $("#text1").html(gardener + lines2[38]);
            break;
        case 140:
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyCloseGrass.png");
            $("#text1").html(gardener + lines2[39]);
            break;
        case 141:
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyClose.png");
            $('#tommyLeft').attr("src", "./images/characters/tommy/tommy1.png");
            $("#text1").html(employer + lines2[40]);
            break;
        case 142:
            $('#lilyRight').attr("src", "./images/characters/gardener/normalLily.png");
            $("#text1").html(gardener + lines2[41]);
            break;
        case 143:
            $('#tommyLeft').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $("#text1").html(employer + lines2[42]);
            break;
        case 144:
            $('#tommyLeft').attr("src", "./images/characters/tommy/urgentTommy.png");
            $("#text1").html(gardener + lines2[43]);
            break;
        case 145:
            $('#tommyLeft').attr("src", "./images/characters/tommy/thinkingTommy.png");
            $("#text1").html(employer + lines2[44]);
            break;
        case 146:
            huhAudio.play();
            $('#lilyRight').attr("src", "./images/characters/gardener/questionLily.png");
            $("#text1").html(gardener + lines2[45]);
            break;
        case 147:
            huhAudio.stop();
            $('#tommyLeft').attr("src", "./images/characters/tommy/tommy1.png");
            $("#text1").html(employer + lines2[46]);
            break;
        case 148:
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyOpenNozzle.png");
            $("#text1").html(gardener + lines2[47]);
            break;
        case 149:
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyCloseNozzle.png");
            $("#text1").html(gardener + lines2[48]);
            break;
        case 150:
            $('#tommyLeft').attr("src", "./images/characters/tommy/concernedTommyMild.png");
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyClose.png");
            $("#text1").html(employer + lines2[49]);
            break;
        case 151:
            $('#tommyLeft').attr("src", "./images/characters/tommy/normalTommy.png");
            $("#text1").html(employer + lines2[50]);
            break;
        case 152:
            $('#tommyLeft').attr("src", "./images/characters/tommy/smileTommyOpenSpring.png");
            $("#text1").html(employer + lines2[51]);
            break;
        case 153:
            $('#tommyLeft').attr("src", "./images/characters/tommy/smileTommyCloseSpring.png");
            $("#text1").html(employer + lines2[52]);
            break;
        case 154:
            lilyhmm.play();
            $('#tommyLeft').attr("src", "./images/characters/tommy/normalTommyBroom.png");
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyOpen.png");
            $("#text1").html(gardener + lines2[53]);
            break;
        case 155:
            lilyhmm.stop();
            $('#tommyLeft').attr("src", "./images/characters/tommy/normalTommy.png");
            $('#lilyRight').attr("src", "./images/characters/gardener/smileLilyClose.png");
            $("#text1").html(gardener + lines2[54]);
            break;                
        case 156:
            $('#tommyLeft').attr("src", "./images/characters/tommy/grinTommyHand.png");
            $("#text1").html(employer + lines2[55]);
            break;
        case 157:
            $('#tommyLeft').attr("src", "./images/characters/tommy/handTommy.png");
            $("#text1").html(employer + lines2[56]);
            break;
        case 158:
            animateDiv();
            removeAllSounds();
            kitchenBackgroundMusic = new sound("./audio/kitchenscene.mp3", "backgroundMusic");
            kitchenBackgroundMusic.play();
            $('#lilyRight').hide(0);
            $('#tommyLeft').hide(0);
            backgroundImagePicker("kitchen.jpg", "kitchen2.jpg");
            $("#text1").html(user + lines2[57]);
            break;
        case 159:
            $("#text1").html(user + lines2[58]);
            break;
        case 160:
            backgroundImagePicker("sink_overflow.png", "sink_overflow.png");
            $("#text1").html(lines2[59]);
            break;
        case 161:
            backgroundImagePicker("kitchen.jpg", "kitchen2.jpg");
            $("#text1").html(user + lines2[60]);
            break;
        case 162:
            $('#tommy').hide(0);
            runningWater.play();
            backgroundImagePicker("sink_overflow.png", "sink_overflow.png");
            $("#text1").html(user + lines2[61]);
            break;
        case 163:
            runningWater.stop();
            $("#next").remove(0);
            $('#overlay').animate({
                opacity: 1,
            }, 1500, function () {
            });
            setTimeout(nextMinigame2, 1500);
            break;
        case 164:
            $("#text1").show(0);
            $("#text2").hide(0);
            console.log("g");
            backgroundImagePicker("kitchen.jpg", "kitchen2.jpg");                
            nextEndGame2();
            break;
        case (thirdSceneNum + 1):
            backgroundImagePicker("kitchen.jpg", "kitchen2.jpg");                
            animateDiv();
            $('#sinkGameWater').hide(0);
            $('#sinkGame').hide(0);
            $('#beginningPage').show(0);
            $('#olivia').show(0);
            whogoesthere.play();
            $("#text1").html(questionMark + lines3[0] + " " + lines3[1]);
            break;
        case 202:
            whogoesthere.stop();
            $("#text1").html(user + lines3[2] + " " + userName + ".");
            break;
        case 203:
            $("#text1").html(user + lines3[3]);
            break;
        case 204:
            $("#text1").html(questionMark + lines3[4]);
            break;
        case 205:
            $('#olivia').attr("src", "./images/characters/chef/creepyOlivia.png");
            $("#text1").html(chef + lines3[5]);
            break;
        case 206:
            $('#olivia').attr("src", "./images/characters/chef/normalOlivia.png");
            $("#text1").html(chef + lines3[6]);
            break;
        case 207:
            $("#text1").html(user + lines3[7]);
            break;
        case 208:
            $("#text1").html(user + lines3[8]);
            break;
        case 209:
            wondering.play();
            $('#olivia').attr("src", "./images/characters/chef/distressOlivia.png");
            $("#text1").html(chef + lines3[9]);
            break;
        case 210:
            wondering.stop();
            $("#text1").html(user + lines3[10]);
            break;
        case 211:
            $('#olivia').attr("src", "./images/characters/chef/mildOlivia.png");
            $("#text1").html(chef + lines3[11]);
            break;
        case 212:
            apologize.play();
            $('#olivia').attr("src", "./images/characters/chef/guiltyOlivia.png");
            $("#text1").html(chef + lines3[12]);
            break;
        case 213:
            apologize.stop();
            $("#text1").html(user + lines3[13]);
            break;
        case 214:
            $('#olivia').hide(0);
            backgroundImagePicker("rinsing.png", "rinsing_square.png");                
            $("#text1").html(user + lines3[14]);
            break;
        case 215:
            backgroundImagePicker("washingdishes.png", "dishes.png");        
            $("#text1").html(user + lines3[15]);
            break;
        case 216:
            isee.play();
            backgroundImagePicker("kitchen.jpg", "kitchen2.jpg");                
            $('#olivia').attr("src", "./images/characters/chef/happyOlivia.png");
            $('#olivia').show(0);
            $("#text1").html(chef + lines3[16]);
            break;
        case 217:
            isee.stop();
            $('#olivia').attr("src", "./images/characters/chef/smileOliviaDefrost.png");
            $("#text1").html(chef + lines3[17]);
            break;
        case 218:
            $('#olivia').attr("src", "./images/characters/chef/smileOlivia.png");
            $('#olivia').hide(0);
            $("#text1").html(user + lines3[18]);
            break;
        case 219:
            $('#olivia').attr("src", "./images/characters/chef/normalOliviaDish.png");
            $('#olivia').show(0);
            $("#text1").html(chef + lines3[19]);
            break;
        case 220:
            $('#olivia').attr("src", "./images/characters/chef/shadyOliviaDish.png");
            $("#text1").html(chef + lines3[20]);
            break;
        case 221:
            $("#text1").html(user + lines3[21]);
            break;
        case 222:
            $('#olivia').attr("src", "./images/characters/chef/smileOlivia.png");
            $("#text1").html(chef + lines3[22]);
            break;
        case 223:
            $('#olivia').hide(0);
            $("#text1").html(lines3[23]);
            break;
        case 224:
            $("#text1").html(user + lines3[24]);
            break;
        case 225:
            $('#olivia').attr("src", "./images/characters/chef/happyOlivia.png");
            $('#olivia').show(0);
            $("#text1").html(chef + lines3[25]);
            break;
        case 226:
            $("#text1").html(user + lines3[26]);
            break;
        case 227:
            $('#olivia').attr("src", "./images/characters/chef/smileOlivia.png");
            $("#text1").html(chef + lines3[27]);
            break;
        case 228:
            $('#olivia').attr("src", "./images/characters/chef/normalOlivia.png");
            $("#text1").html(chef + lines3[28]);
            break;
        case 229:
            $("#text1").html(user + lines3[29]);
            break;
        case 230:
            $('#olivia').attr("src", "./images/characters/chef/creepyOlivia.png");
            $("#text1").html(chef + lines3[30]);
            break;
        case 231:
            mention.play();
            $('#olivia').attr("src", "./images/characters/chef/normalOliviaWashing.png");
            $("#text1").html(chef + lines3[31]);
            break;
        case 232:
            $("#text1").html(user + lines3[32]);
            break;
        case 233:
            mention.stop();
            $('#olivia').attr("src", "./images/characters/chef/mildOliviaWashing.png");
            $("#text1").html(chef + lines3[33]);
            break;
        case 234:
            $('#olivia').attr("src", "./images/characters/chef/guiltyOliviaWashing.png");
            $("#text1").html(chef + lines3[34]);
            break;
        case 235:
            $('#olivia').attr("src", "./images/characters/chef/guiltyOlivia.png");
            $("#text1").html(user + lines3[35]);
            break;
        case 236:
            $("#text1").html(user + lines3[36]);
            break;
        case 237:
            leaveAudio.play();
            $('#olivia').attr("src", "./images/characters/chef/smileOlivia.png");
            $("#text1").html(chef + lines3[37] + " " + userAlone);
            break;
        case 238:
            removeAllSounds();
            leaveAudio.stop();
            hotelBackgroundMusic = new sound("./audio/lastscene.mp3", "backgroundMusic");
            hotelBackgroundMusic.play();
            $('#olivia').hide(0);
            animateDiv();
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $('#tommy').show(0);
            backgroundImagePicker("lobby_night.jpg", "lobby_night2.jpg");
            $("#text1").html(employer + lines3[38]);
            break;
        case 239:
            $("#text1").html(user + lines3[39]);
            break;
        case 240:
            $('#tommy').attr("src", "./images/characters/tommy/normalTommy.png");
            $("#text1").html(employer + lines3[40]);
            break;
        case 241:
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $("#text1").html(employer + lines3[41]);
            break;
        case 242:
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyClose.png");
            $("#text1").html(employer + lines3[42]);
            break;
        case 243:
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $("#text1").html(employer + lines3[43]);
            break;
        case 244:
            $('#tommy').attr("src", "./images/characters/tommy/normalTommy.png");
            $("#text1").html(user + lines3[44]);
            break;
        case 245:
            $("#text1").html(user + lines3[45]);
            break;
        case 246:
            $("#text1").html(user + lines3[46]);
            break;
        case 247:
            $("#text1").html(user + lines3[47]);
            break;
        case 248:
            thatsit.play();
            $('#tommy').attr("src", "./images/characters/tommy/grinTommyHand.png");
            $("#text1").html(employer + lines3[48]);
            break;
        case 249:
            $('#tommy').hide(0);
            $("#text1").html(lines3[49]);
            break;
        case 250:
            thatsit.stop();
            $('#tommy').attr("src", "./images/characters/tommy/handTommy.png");
            $('#tommy').show(0);
            $("#text1").html(employer + lines3[50]);
            break;
        case 251:
            $("#text1").html(user + lines3[51]);
            break;
        case 252:
            thats.play();
            $('#tommy').attr("src", "./images/characters/tommy/tommy1.png");
            $("#text1").html(employer + lines3[52]);
            break;
        case 253:
            thats.stop();
            $("#text1").html(user + lines3[53]);
            break;
        case 254:
            $('#tommy').hide(0);
            backgroundImagePicker("rainfall.jpg", "rainfall2.jpg");
            $("#text1").html(user + lines3[54]);
            break;
        case 255:
            backgroundImagePicker("city_picture1.jpg", "city_picture2.jpg");
            $("#text1").html(user + lines3[55]);
            break;
        case 256:
            $("#text1").html(user + lines3[56]);
            break;
        case 257:
            backgroundImagePicker("lobby_night.jpg", "lobby_night2.jpg");
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpenTwo.png");
            $('#tommy').show(0);
            $("#text1").html(employer + lines3[57]);
            break;
        case 258:
            listen.play();
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $('#tommy').hide(0);
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $('#richard').attr("src", "./images/characters/richard/smileRichardOpen.png");
            $('#richard').show(0);
            $("#text1").html(maintenanceGuy + lines3[58] + " " + userName + "! " + lines3[59]);
            break;
        case 259:
            listen.stop();
            $("#next").remove(0);
            $('#overlay').animate({
                opacity: 1,
            }, 1500, function () {
            });
            setTimeout(nextMinigame3, 1500);
            break;
        case 260: 
            nextEndGame3();
            break;
        case (lastSceneNum+1):
            animateDiv();
            $('#beginningPage').show(0);
            $('#sliceDIV').hide(0);
            $('#sliceGame').hide(0);
            $("#text1").html("You successfully saved enough water...for now...");
            break;
        case 302:
            $('#richard').attr("src", "./images/characters/richard/smileRichard.png");
            $("#text1").html(maintenanceGuy + lines3[60]);
            break;
        case 303:
            $('#richard').hide(0);
            $("#text1").html(lines3[61]);
            $.ajax({
                url: "./js/userName_post.php",
                type: "POST",
                async: false,
                data: {
                    "done": 1,
                    "playerName": userName,
                    "miniGame1": miniGame1Pass,
                    "miniGame2": miniGame2Pass,
                    "miniGame3": miniGame3Pass
                },
                success: function(data){
                    console.log(data);
                }
            })
            break;
        case 304:       
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyOpen.png");
            $('#tommy').show(0);
            $("#text1").html(employer + lines3[62]);
            break;
        case 305:       
            $('#tommy').attr("src", "./images/characters/tommy/smileTommyClose.png");
            $("#text1").html(user + lines3[63]);
            break;
        case 306:       
            nothatsnotit.play();
            $('#tommy').attr("src", "./images/characters/tommy/alrightTommy.png");
            $("#text1").html(employer + lines3[64]);
            break;
        case 307:     
            nothatsnotit.stop();
            $('#tommy').attr("src", "./images/characters/tommy/thinkingTommy.png");
            $("#text1").html(employer + lines3[65]);
            break;
        case 308:     
            $('#tommy').attr("src", "./images/characters/tommy/grinTommyHand.png");
            $("#text1").html(employer + lines3[66]);
            break;
        case 1000:
            animateDiv();
            $('#raindropDIV').remove(0);
            $('#raindropGame').remove(0);
            $('#beginningPage').show(0);
            $("#text1").html(employer + "Although we did not collect all the drops, we fixed the pipes. Everything should be all good for now.");
            miniGame1Pass = 1;
            textNum = secondSceneNum;
            break;
        case 2000:
            animateDiv();
            $('#sinkGameWater').hide(0);
            $('#sinkGame').hide(0);
            $('#beginningPage').show(0);
            $("#text1").html("You couldn't turn off all the faucets in time... <br>Water ended up overflowing out of the sink...");
            miniGame2Pass = 1;
            break;
        case 2001:
            $("#text1").html(questionMark + lines3[0] + " " + lines3[1]);
            $('#olivia').show(0);
            textNum = thirdSceneNum+1;
            whogoesthere.play();
            break;
        case 3000:
            animateDiv();
            $('#beginningPage').show(0);
            $('#sliceDIV').hide(0);
            $('#sliceGame').hide(0);
            miniGame3Pass = 1;
            $("#text1").html("Fortunately, even with your mistake, Olivia managed to speak to the hotel guests and convinced them to conserve water...");
            break;
        case 3001:
            $('#richard').show(0);
            $('#richard').attr("src", "./images/characters/richard/normalRichard.png");
            $("#text1").html(maintenanceGuy + "It was a little close but...");
            textNum = lastSceneNum+1;
            break;
        default:
            location.reload(false);
            break;
    }
};

function animateDiv() {
    $('#overlay').animate({
        opacity: 1,
    }, 0, function () {
    });
    $('#overlay').animate({
        opacity: 0,
    }, 1000, function () {
    });
}

function animateDivSlow() {
    $('#overlay').animate({
        opacity: 1,
    }, 0, function () {
    });
    $('#overlay').animate({
        opacity: 0,
    }, 3500, function () {
    });
}

function nextMinigame1() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    $('#beginningPage').hide(0);
    $('#raindropDIV').show(0);
    startRaindropGame();
    if (width > height) {
        document.getElementById("raindropGame").style.backgroundImage = 'url("./images/background/basement_blur.jpg")';
    } else {
        document.getElementById("raindropGame").style.backgroundImage = 'url("./images/background/basement_square_blur.png")';
    }
    $('#overlay').animate({
        opacity: 0,
    }, 1000, function () {
    });
    $("#text1").html("The pipes are leaking! <br>Collect water drops and fill the bucket before time runs out!");
}

function nextMinigame2() {
    $("#text1").hide(0);
    $('#beginningPage').hide(0);
    $('#sinkGameWater').show(0);
    $('#sinkGame').show(0);
    startSinkFill();
    updateRandomFaucet();
    updateTapPage();
    startTimer();
    $('#overlay').animate({
        opacity: 0,
    }, 1000, function () {
    });
}

function nextMinigame3() {
    $('#beginningPage').hide(0);
    $('#richard').hide(0);
    $('#sliceDIV').show(0);
    $('#sliceGame').show(0);
    if (width > height) {
        document.getElementById("sliceGame").style.backgroundImage = 'url("./images/background/lobbyblur.jpg")';
    } else {
        document.getElementById("sliceGame").style.backgroundImage = 'url("./images/background/lobby_night2_blur.jpg")';
    }
    startSliceGame();
    $('#overlay').animate({
        opacity: 0,
    }, 1000, function () {
    });
    $("#text1").html("Slice the objects wasting water.");
}

function nextEndGame() {
    //console.log((Math.ceil(gameArea.frameNum / 50)));
    //console.log(collected);
    if (collected == 100) {
        $("#text1").html("You did it.");
        textNum = secondSceneNum;
    } else if ((Math.ceil(gameArea.frameNum / 50) == 20)) {
        $("#text1").html("You failed to collect enough water droplets.<br/>You wasted some water.");
        textNum = 999;
    } else {
        //console.log("Game not completed.");
    }

}

function nextEndGame2() {
    if (timer > 0) {
        $("#text1").html("You failed to save the water.");
        textNum = 1999;
    } else {
        $("#text1").html("You did it.");
        textNum = thirdSceneNum;
    }
}

function nextEndGame3() {
    if (lives <= 0) {
        $("#text1").html("You failed to save water.");
        textNum = 2999;
    } else {
        $("#text1").html("You did it.");
        textNum = lastSceneNum;
    }
}

function backgroundImagePicker(src1, src2) {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    if (width > height) {
        document.getElementById("beginningPage").style.backgroundImage = "url('./images/background/" + src1 + "')";
    } else {
        document.getElementById("beginningPage").style.backgroundImage = "url('./images/background/" + src2 + "')";
    }
}

function updatePage() {
    var text = document.getElementsByTagName("p");
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    var imageCenter = document.getElementsByClassName("characterImgCenter");
    var imageLeft = document.getElementsByClassName("characterImgLeft");
    var imageRight = document.getElementsByClassName("characterImgRight");
    var imageIcon = document.getElementsByClassName("icons");
    var imageIcon2 = document.getElementsByClassName("icons2");
    var soundManage = document.getElementsByClassName("manageSound");

    for (let i = 0; i < text.length; i++) {
        if (width > height) {
            text[i].style.fontSize = height * 0.04 + "px";
        } else {
            text[i].style.fontSize = width * 0.04 + "px";
        }
    }
    for (let i = 0; i < imageCenter.length; i++) {

        if (height > width) {
            var imageWidth = width * 0.7;
            imageCenter[i].style.width = imageWidth + "px";
            imageCenter[i].style.height = imageWidth + "px";
            $('.characterImgCenter').css("left", (width / 2 - imageWidth / 2) + "px");
        } else {
            var imageHeight = height * 0.6;
            imageCenter[i].style.width = imageHeight + "px";
            imageCenter[i].style.height = imageHeight + "px";
            $('.characterImgCenter').css("left", (width / 2 - imageHeight / 2) + "px");
        }
    }
    for (let i = 0; i < imageLeft.length; i++) {
        if (height > width) {

            var imageWidth = width * 0.7;
            imageLeft[i].style.width = imageWidth + "px";
            imageLeft[i].style.height = imageWidth + "px";
            $('.characterImgLeft').css("left", (width * 0.5 - imageWidth + "px"));
        } else {
            var imageHeight = height * 0.6;
            imageLeft[i].style.width = imageHeight + "px";
            imageLeft[i].style.height = imageHeight + "px";
            $('.characterImgLeft').css("left", (width * 0.5 - imageHeight + "px"));
        }
    }
    for (let i = 0; i < imageRight.length; i++) {
        if (height > width) {

            var imageWidth = width * 0.7;
            imageRight[i].style.width = imageWidth + "px";
            imageRight[i].style.height = imageWidth + "px";
            $('.characterImgRight').css("right", (width * 0.5 - imageWidth + "px"));
        } else {
            var imageHeight = height * 0.6;
            imageRight[i].style.width = imageHeight + "px";
            imageRight[i].style.height = imageHeight + "px";
            $('.characterImgRight').css("right", (width * 0.5 - imageHeight + "px"));
        }
    }

    for (let i = 0; i < imageIcon.length; i++) {

        if (height > width) {
            var imageWidth = width * 0.15;
            imageIcon[i].style.width = imageWidth + "px";
            imageIcon[i].style.height = imageWidth + "px";
        } else {
            var imageHeight = height * 0.15;
            imageIcon[i].style.width = imageHeight + "px";
            imageIcon[i].style.height = imageHeight + "px";
        }
    }
    for (let i = 0; i < imageIcon2.length; i++) {

        if (height > width) {
            var imageWidth = width * 0.19;
            imageIcon2[i].style.width = imageWidth + "px";
            imageIcon2[i].style.height = imageWidth + "px";
        } else {
            var imageHeight = height * 0.19;
            imageIcon2[i].style.width = imageHeight + "px";
            imageIcon2[i].style.height = imageHeight + "px";
        }
    }

    for (let i = 0; i < soundManage.length; i++) {

        if (height > width) {
            var imageWidth = width * 0.08;
            soundManage[i].style.width = imageWidth + "px";
            soundManage[i].style.height = imageWidth + "px";
        } else {
            var imageHeight = height * 0.08;
            soundManage[i].style.width = imageHeight + "px";
            soundManage[i].style.height = imageHeight + "px";
        }
    }
    setTimeout(updatePage, 20);
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        if (width > height) {
            $("#changeOrientation").show(0);
        } else {
            $("#changeOrientation").hide(0);
        }
    }
}
updatePage();

///SOUNDS FUNCTION///
var soundsMuted = false;

function sound(src, backgroundMusic) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("class", backgroundMusic);
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    if (backgroundMusic == "backgroundMusic") {
        this.sound.setAttribute("loop", "loop");
    }
    this.play = function () {
        if(soundsMuted == false) {
            this.sound.play();
        }
    }
    this.stop = function () {
        this.sound.currentTime = 0;
        this.sound.pause();
    }
}

function removeAllSounds() {
    var allSounds = document.getElementsByTagName("audio");
    var i = 0;
    while (i < allSounds.length) {
        ////console.log(allSounds);
        allSounds[i].pause();
        allSounds[i].parentNode.removeChild(allSounds[i]);
    }
}

function removeAllSoundEffects() {
    var allSounds = document.getElementsByClassName("effect");
    var i = 0;
    while (i < allSounds.length) {
        ////console.log(allSounds);
        allSounds[i].pause();
        allSounds[i].parentNode.removeChild(allSounds[i]);
    }
}

/// Use this to stop and remove sounds
function stopAllSounds() {
    var allSounds = document.getElementsByClassName("backgroundMusic");
    if (allSounds.length == 0) {
        return;
    } else if (allSounds.length > 1) {
        allSounds[0].pause();
        allSounds[0].parentNode.removeChild(allSounds[0]);
        return;
    }
    if (allSounds[0].volume >= 0.1) {
        allSounds[0].volume -= 0.1;
        setTimeout(stopAllSounds, 700);
    } else {
        allSounds[0].pause();
        removeAllSounds();
    }
}