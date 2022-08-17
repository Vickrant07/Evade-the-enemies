let canvas;
let context;

let fpsInterval = 1000 / 30; // the denominator is frames-per-second
let now;
let then = Date.now();

let player = {
    x : 0,
    y : 0,
    width : 48,
    height : 64,
    frameX : 0,
    frameY : 2,
    xChange : 0,
    yChange : 0,
};

let enemy0 = {
    x : 0,
    y : 0,
    width : 48,
    height : 64,
    frameX : 1,
    frameY : 2,
    xChange : 0,
    yChange : 0,
};

let enemy1 = {
    x : 0,
    y : 0,
    width : 48,
    height : 64,
    frameX : 1,
    frameY : 2,
    xChange : 0,
    yChange : 0,
};

let enemy2 = {
    x : 0,
    y : 0,
    width : 48,
    height : 64,
    frameX : 1,
    frameY : 2,
    xChange : 0,
    yChange : 0,
};

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;

let IMAGES = {player: "player.png", enemy0: "skeleton.png", enemy1: "warrior_skeleton.png", enemy2: "demon_skeleton.png"};

document.addEventListener("DOMContentLoaded", init, false);
//--------------------------------------------------------
function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");  

    player.x = canvas.width / 2;
    player.y = player.height;

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);

    load_images(draw);
}
//-------------------------------------------------------------
let i = 0;
function draw() {
    let request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    } 
    then = now - (elapsed % fpsInterval);

    // player
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "green";
    context.drawImage(IMAGES.player,
        player.frameX * player.width, player.frameY * player.height, player.width, player.height,
        player.x, player.y, player.width, player.height);
    if ((moveLeft || moveRight) && ! (moveLeft && moveRight)) {
        player.frameX = (player.frameX + 1) % 3;
    }
    if ((moveUp || moveDown) && ! (moveUp && moveDown)) {
        player.frameX = (player.frameX + 1) % 3;
    }

    // Handle key presses
    if (moveLeft) {
        player.xChange =  player.xChange - 0.5;
        player.frameY = 3;
    } 
    if (moveRight) {
        player.xChange = player.xChange + 0.5;
        player.frameY = 1;
    }
    if (moveUp) {
        player.yChange = player.yChange - 0.5;
        player.frameY = 0;
    } 
    if (moveDown) {
        player.yChange = player.yChange + 0.5;
        player.frameY = 2;
    }

    // Physics
    player.xChange = player.xChange * 0.9; // friction
    player.yChange = player.yChange * 0.9; // friction

    //canvas walls for player
    if (player.x < 0) {
        player.xChange = player.xChange * -1;
    } else if (player.x + player.width >= context.canvas.width) {
        player.xChange = player.xChange * -1;
    } 
    if (player.y < 0) {
        player.yChange = player.yChange * -1;
    } else if (player.y + player.height >= context.canvas.height) {
        player.yChange = player.yChange * -1;
    } 

    // Update the player
    player.x = player.x + player.xChange;
    player.y = player.y + player.yChange;

    //-----------------------------------------------------------------------------
    //draw enemy 0
    if (i === 1) {
    enemy0.x = canvas.width / 2;
    }
    context.drawImage(IMAGES.enemy0,
        enemy0.frameX * enemy0.width, enemy0.frameY * enemy0.height, enemy0.width, enemy0.height,
        enemy0.x, enemy0.y, enemy0.width, enemy0.height);
    //draw enemy 1
    if (i === 1) {
    enemy1.x = enemy1.width / 2;
    }
    context.drawImage(IMAGES.enemy1,
        enemy1.frameX * enemy1.width, enemy1.frameY * enemy1.height, enemy1.width, enemy1.height,
        enemy1.x, enemy1.y, enemy1.width, enemy1.height);
    //draw enemy 2
    if (i === 1) {
    enemy2.x = canvas.width - enemy2.width;

    }
    context.drawImage(IMAGES.enemy2,
        enemy2.frameX * enemy2.width, enemy2.frameY * enemy2.height, enemy2.width, enemy2.height,
        enemy2.x, enemy2.y, enemy2.width, enemy2.height);
    
    moveEnemy();

    i += 1
    score()

    // Collisions with enemies
    function player_collides() {
        if (player.x + player.width < enemy0.x || 
            enemy0.x + enemy0.width < player.x ||
            player.y > enemy0.y + enemy0.height ||
            enemy0.y > player.y + player.height) {
                return false;
        } else if (player.x + player.width < enemy1.x || 
            enemy1.x + enemy1.width < player.x ||
            player.y > enemy1.y + enemy1.height ||
            enemy1.y > player.y + player.height) {
                return false;
        } else if (player.x + player.width < enemy2.x || 
            enemy2.x + enemy2.width < player.x ||
            player.y > enemy2.y + enemy2.height ||
            enemy2.y > player.y + player.height) {
                return false;
        } else {
            return true;
        }
    }
    // check for collision with enemy
    if (player_collides()) {
        lostStop();
        return;
    } 
}
//-----------------------------------------------------------------
function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    }
    startTimeCounter();
}
//------------------------------------------------------------------
function moveEnemy() {
    // enemy0 movement
    // Reference from: https://www.reddit.com/r/javascript/comments/2pty1w/how_do_i_make_an_object_chase_an_other_object/
    // subtract (= difference vector)

    if (moveDown || moveUp || moveLeft || moveRight) {
        // do stuff
        let dx0 = player.x - enemy0.x;
        let dy0 = player.y - enemy0.y;
    
        // normalize (= direction vector)
        let length0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
        if (length0) {
            dx0 /= length0;
            dy0 /= length0;
        }
        //enemy movement according to the player
        if (player.xChange > 0 && player.yChange > 0) {
            enemy0.x += dx0 * player.xChange - 0.9;
            enemy0.y += dy0 * player.yChange - 0.9;
        }else if (player.xChange < 0 && player.yChange < 0) {
            enemy0.x -= dx0 * player.xChange - 0.9;
            enemy0.y -= dy0 * player.yChange - 0.9;
        }else if (player.xChange > 0 && player.yChange < 0) {
            enemy0.x += dx0 * player.xChange - 0.9;
            enemy0.y -= dy0 * player.yChange - 0.9;
        }else if (player.xChange < 0 && player.yChange > 0) {
            enemy0.x -= dx0 * player.xChange - 0.9;
            enemy0.y += dy0 * player.yChange - 0.9;
        }

        //update enemy0
        enemy0.x = enemy0.x + enemy0.xChange;
        enemy0.y = enemy0.y + enemy0.yChange;
    } else {
        //============================random movement
        //check range
        if (enemy0.x < 0) {
            enemy0.x = context.canvas.width;
        } else if (enemy0.x > context.canvas.width) {
            enemy0.x = 0;
        }
        if (enemy0.y < 0) {
            enemy0.y = context.canvas.height;
        } else if (enemy0.y > context.canvas.height) {
            enemy0.y = 0;
        }
        
        //update enemy0
        enemy0.x = enemy0.x + enemy0.xChange;
        enemy0.y = enemy0.y + enemy0.yChange;

    }

    //enemy0 collision with canvas walls
    if (enemy0.x <= 0) {
        enemy0.xChange = enemy0.xChange * -1;
        enemy0.yChange = enemy0.yChange * -1;
    } else if (enemy0.x + enemy0.width >= canvas.width) {
        enemy0.xChange = enemy0.xChange * -1;
        enemy0.yChange = enemy0.yChange * -1;
    } 
    if (enemy0.y <= 0) {
        enemy0.yChange = enemy0.yChange * -1;
        enemy0.xChange = enemy0.xChange * -1;
    } else if (enemy0.y + enemy0.height >= canvas.height) {
        enemy0.yChange = enemy0.yChange * -1;
        enemy0.xChange = enemy0.xChange * -1;
    } 

    //-------------------------------------
    // enemy1
    // Reference from: https://www.reddit.com/r/javascript/comments/2pty1w/how_do_i_make_an_object_chase_an_other_object/
    // subtract (= difference vector)
    let dx1 = player.x - enemy1.x;
    let dy1 = player.y - enemy1.y;
  
    // normalize (= direction vector)
    let length1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    if (length1) {
        dx1 /= length1;
        dy1 /= length1;
    }
    //enemy movement according to the player
    if (player.xChange > 0 && player.yChange > 0) {
        enemy1.x += dx1 * player.xChange - 0.5;
        enemy1.y += dy1 * player.yChange - 0.5;
    }else if (player.xChange < 0 && player.yChange < 0) {
        enemy1.x -= dx1 * player.xChange - 0.5;
        enemy1.y -= dy1 * player.yChange - 0.5;
    }else if (player.xChange > 0 && player.yChange < 0) {
        enemy1.x += dx1 * player.xChange - 0.5;
        enemy1.y -= dy1 * player.yChange - 0.5;
    }else if (player.xChange < 0 && player.yChange > 0) {
        enemy1.x -= dx1 * player.xChange - 0.5;
        enemy1.y += dy1 * player.yChange - 0.5;
    }

    // Update the enemy1
    enemy1.x = enemy1.x + enemy1.xChange;
    enemy1.y = enemy1.y + enemy1.yChange;
    
    //enemy1 collision
    if (enemy1.x <= 0) {
        enemy1.xChange = enemy1.xChange * -1;
        enemy1.yChange = enemy1.yChange * -1;
    } else if (enemy1.x + enemy1.width >= canvas.width) {
        enemy1.xChange = enemy1.xChange * -1;
        enemy1.yChange = enemy1.yChange * -1;
    } 
    if (enemy1.y <= 0) {
        enemy1.yChange = enemy1.yChange * -1;
        enemy1.xChange = enemy1.xChange * -1;
    } else if (enemy1.y + enemy1.height >= canvas.height) {
        enemy1.yChange = enemy1.yChange * -1;
        enemy1.xChange = enemy1.xChange * -1;
    } 

    //------------------------------------
    // enemy2
    // Reference from: https://www.reddit.com/r/javascript/comments/2pty1w/how_do_i_make_an_object_chase_an_other_object/
    // subtract (= difference vector)
    let dx2 = player.x - enemy2.x;
    let dy2 = player.y - enemy2.y;
  
    // normalize (= direction vector)
    let length2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    if (length2) {
        dx2 /= length2;
        dy2 /= length2;
    }

    //enemy movement according to the player
    if (player.xChange > 0 && player.yChange > 0) {
        enemy2.x += dx2 * player.xChange ;
        enemy2.y += dy2 * player.yChange ;
    }else if (player.xChange < 0 && player.yChange < 0) {
        enemy2.x -= dx2 * player.xChange ;
        enemy2.y -= dy2 * player.yChange ;
    }else if (player.xChange > 0 && player.yChange < 0) {
        enemy2.x += dx2 * player.xChange ;
        enemy2.y -= dy2 * player.yChange ;
    }else if (player.xChange < 0 && player.yChange > 0) {
        enemy2.x -= dx2 * player.xChange ;
        enemy2.y += dy2 * player.yChange ;
    }

    // Update the enemy2
    enemy2.x = enemy2.x + enemy2.xChange;
    enemy2.y = enemy2.y + enemy2.yChange;
        
    //enemy2 collision
    if (enemy2.x <= 0) {
        enemy2.xChange = enemy2.xChange * -1;
        enemy2.yChange = enemy2.yChange * -1;
    } else if (enemy2.x + enemy2.width >= canvas.width) {
        enemy2.xChange = enemy2.xChange * -1;
        enemy2.yChange = enemy2.yChange * -1;
    } 
    if (enemy2.y <= 0) {
        enemy2.yChange = enemy2.yChange * -1;
        enemy2.xChange = enemy2.xChange * -1;
    } else if (enemy2.y + enemy2.height >= canvas.height) {
        enemy2.yChange = enemy2.yChange * -1;
        enemy2.xChange = enemy2.xChange * -1;
    } 
}

//--------------------------------
function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
    } else if (key === "ArrowDown") {
        moveDown = false;
    }
}
//----------------------------------
function load_images(callback) {
    let num_images = Object.keys(IMAGES).length;
    let loaded = function() {
        num_images = num_images - 1;
        if (num_images === 0) {
            callback();
        }
    };
    for (let name of Object.keys(IMAGES)) {
        let img = new Image();
        img.addEventListener("load", loaded, false);
        img.src = IMAGES[name];
        IMAGES[name] = img;
    }
}
//-------------------------------------
// generating randint 
function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
//------------------------------------
//Reference form: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
let startTime = Math.floor(Date.now() / 1000); //Get the starting time (right now) in seconds

function startTimeCounter() {
    let now = Math.floor(Date.now() / 1000); // get the time now
    let diff = now - startTime; // diff in seconds between now and start
    let m = Math.floor(diff / 60); // get minutes value (quotient of diff)
    let s = Math.floor(diff % 60); // get seconds value (remainder of diff)
    m = checkTime(m); // add a leading zero if it's single digit
    s = checkTime(s); // add a leading zero if it's single digit
    document.getElementById("timer").innerHTML = m + ":" + s; // update the element where the timer will appear
    let t = setTimeout(startTimeCounter, 500); // set a timeout to update the timer
    if (m == 5){
        winStop()
    }
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
//--------------------------------------
function winStop() {
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    window.cancelAnimationFrame(request_id);
    document.getElementById("timer").innerHTML = "00:00"
    clearTimeout()
}
function lostStop() {
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    window.cancelAnimationFrame(request_id);
    document.getElementById("timer").innerHTML = "00:00"
    clearTimeout()
}

//Reference :https://stackoverflow.com/questions/39813241/javascript-time-based-score-in-firefox
function score() {
    let start = new Date().getTime(),
    score = '0.0';

    let interval = window.setInterval(
    function() {
    let time = new Date().getTime() - start;

    score = Math.floor(time / 1000);

    if(score === 100) { 
        window.clearInterval(interval); 
        if(!alert("You win!\nPress 'OK' to play again")){
            window.location.reload();
        } 
    }
    
    document.getElementById('score').innerHTML = score;
    });
    
}

    