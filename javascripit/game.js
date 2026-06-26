let canvas, context, characterImage, x = 65, y = 525;//stores canvas drawings and images 
const imageWidth = 75, imageHeight = 75; // image dimensions
let tieFighterImage, tieFighterImageLoaded = false; // stores tie fighter enemies
let shootImage, shootX = null, shootY = null; // stores the player shot imgage and make sure it not active yet
const shotSpeed = 5; // how fast player shot moves
const shootWidth = 10, shootHeight = 30; // size of the shot image
let score = 0; // stores player score
let xWingLives = 6; // stores player lives
let enemyShots = []; // stores which enmeny shoots
let enemyShotImage; // holds enemy shot image 
let gameOverFlag = false; // means game has not ended
let shootInterval = 2000; // sets player shot to fire in 2 seconds aftert pressing space bar
let currentLevelIndex = 0; // track current level
let enemyShootInterval; // store interval ID

// levels for the game(position of each tie fighter, the rules for tie fighter shooting and if they move or not)
const levels = [
    {
        tiePositions: [
            { x: 125, y: 150 }, { x: 250, y: 150 }, { x: 375, y: 150 }, { x: 500, y: 150 }, { x: 625, y: 150 },
            { x: 125, y: 225 }, { x: 250, y: 225 }, { x: 375, y: 225 }, { x: 500, y: 225 }, { x: 625, y: 225 },
            { x: 125, y: 300 }, { x: 250, y: 300 }, { x: 375, y: 300 }, { x: 500, y: 300 }, { x: 625, y: 300 },
            { x: 125, y: 375 }, { x: 250, y: 375 }, { x: 375, y: 375 }, { x: 500, y: 375 }, { x: 625, y: 375 }
        ],
        enemyShootInterval: 2700, // how often enemy shoot 2.7s
        enemyShotSpeed: 3, // how fast it moves by pixels
        moveTies: false // there is no movement for this level
    },
    {
        tiePositions: [
            { x: 125, y: 150, direction: -1, speed: 1 }, { x: 250, y: 150, direction: -1, speed: 1 }, { x: 375, y: 150, direction: -1, speed: 1 }, { x: 500, y: 150, direction: -1, speed: 1 }, { x: 625, y: 150, direction: -1, speed: 1 },
            { x: 125, y: 225, direction: 1, speed: 1 }, { x: 250, y: 225, direction: 1, speed: 1 }, { x: 375, y: 225, direction: 1, speed: 1 }, { x: 500, y: 225, direction: 1, speed: 1 }, { x: 625, y: 225, direction: 1, speed: 1 },
            { x: 125, y: 300, direction: -1, speed: 1 }, { x: 250, y: 300, direction: -1, speed: 1 }, { x: 375, y: 300, direction: -1, speed: 1 }, { x: 500, y: 300, direction: -1, speed: 1 }, { x: 625, y: 300, direction: -1, speed: 1 },
            { x: 125, y: 375, direction: 1, speed: 1 }, { x: 250, y: 375, direction: 1, speed: 1 }, { x: 375, y: 375, direction: 1, speed: 1 }, { x: 500, y: 375, direction: 1, speed: 1 }, { x: 625, y: 375, direction: 1, speed: 1 }
        ],

        enemyShootInterval: 2500,
        enemyShotSpeed: 4,
        moveTies: true// there is movement for this level (-1 = left, 1 = right and speed is how fast they move)
    },
    {
        tiePositions: [
            { x: 125, y: 150, direction: -1, speed: 1 }, { x: 250, y: 150, direction: -1, speed: 1 }, { x: 375, y: 150, direction: -1, speed: 1 }, { x: 500, y: 150, direction: 1, speed: 1 }, { x: 625, y: 150, direction: 1, speed: 1 },
            { x: 125, y: 225, direction: -1, speed: 1 }, { x: 250, y: 225, direction: -1, speed: 1 }, { x: 375, y: 225, direction: 1, speed: 1 }, { x: 500, y: 225, direction: 1, speed: 1 }, { x: 625, y: 225, direction: 1, speed: 1 },
            { x: 125, y: 300, direction: -1, speed: 1 }, { x: 250, y: 300, direction: -1, speed: 1 }, { x: 375, y: 300, direction: -1, speed: 1 }, { x: 500, y: 300, direction: 1, speed: 1 }, { x: 625, y: 300, direction: 1, speed: 1 },
            { x: 125, y: 375, direction: -1, speed: 1 }, { x: 250, y: 375, direction: -1, speed: 1 }, { x: 375, y: 375, direction: 1, speed: 1 }, { x: 500, y: 375, direction: 1, speed: 1 }, { x: 625, y: 375, direction: 1, speed: 1 }
        ],
        enemyShootInterval: 2000,
        enemyShotSpeed: 5,
        moveTies: true 
    }
];

// loads the images and starts the game loop
function xwingImg() {
    canvas = document.getElementById('X-wing');
    context = canvas.getContext('2d');
    characterImage = new Image();
    characterImage.src = 'image/x-wing 2.png';

    TieFighterImage();
    ShootImage();
    EnemyShotImage();
    
    // loads all the functions on the page to correct positon
        characterImage.onload = function () {
        context.drawImage(characterImage, x, y, imageWidth, imageHeight);
        applyLevelSettings(levels[currentLevelIndex]); // apply settings for the first level
        drawTieFighters();
        startEnemyShooting();
        startGameLoop();
    };

    window.addEventListener('keydown', movement); //calls movement function for keyboard 
}

// apply settings for the current level
function applyLevelSettings(level) {
    shootInterval = level.enemyShootInterval; //sets how often the tie fighter fires at a player 
    enemyShotSpeed = level.enemyShotSpeed; //sets how fast the shot moves down
}

// tie fighter image
function TieFighterImage() {
    tieFighterImage = new Image();
    tieFighterImage.src = 'image/tie-fighter.png';

    tieFighterImage.onload = function () {
        tieFighterImageLoaded = true;
        drawTieFighters();
    };
}

//x wing shot image
function ShootImage() {
    shootImage = new Image();
    shootImage.src = 'image/shoot.png';
}

// enemy shot image
function EnemyShotImage() {
    enemyShotImage = new Image();
    enemyShotImage.src = 'image/enemyshoot.png';
}

// main game loop
function startGameLoop() {
    gameLoopInterval = setInterval(() => {
        if (gameOverFlag) return;

        drawCharacter();
        if (shootY !== null) drawShoot();
        drawEnemyShots();
    }, 20);
}

// draw the X-Wing, tie fighters, score, and lives
function drawCharacter() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(characterImage, x, y, imageWidth, imageHeight);
    drawTieFighters();
    showScore();
    showLives();
}

//draw tie fighters positions with movement and make sure correct level is drawn
function drawTieFighters() {
    if (tieFighterImageLoaded) {
        levels[currentLevelIndex].tiePositions.forEach(position => {
            if (levels[currentLevelIndex].moveTies) { // check if movement is enabled
                // update the position for movement
                position.x += position.speed * position.direction;

                // changes direction the opposite way if they reach the edge of the canvas
                if (position.x <= 0 || position.x + imageWidth >= canvas.width) {
                    position.direction *= -1;
                }
            }

            // draw the TIE fighter
            context.drawImage(tieFighterImage, position.x, position.y, imageWidth, imageHeight);
        });
    }
}

// X-Wing shooting function
function drawShoot() {
    if (gameOverFlag) return;// cancels player shooting if game flag is true
    shootY -= shotSpeed; // moves shot upwards

    context.drawImage(shootImage, shootX + imageWidth / 2 - shootWidth / 2, shootY, shootWidth, shootHeight);
    tieRemove();

    if (shootY <= 0) shootY = null; // if shot goes off the screen it reset to null
}

// remove a tie fighter if hit by X-Wing shot
function tieRemove() {
    const positions = levels[currentLevelIndex].tiePositions; // gets the array with all tiefighter posistion
    // checks for collision with each tie fighter ( if statement is the boundry for the tie fighter )
    positions.forEach((position, index) => {
        if (
            shootX + imageWidth / 2 - shootWidth / 2 < position.x + imageWidth &&
            shootX + imageWidth / 2 - shootWidth / 2 + shootWidth > position.x &&
            shootY < position.y + imageHeight &&
            shootY + shootHeight > position.y
        ) {
            positions.splice(index, 1); // removes tie fighter
            shootY = null; // reset player shot so player fire again 
            score += 10; // increase score by 10
            if (positions.length === 0) levelUp(); // if no tiefighter are on the screen it starts next level
        }
    });
}

// enemy shooting
function startEnemyShooting() {
    enemyShootInterval = setInterval(() => {
        if (gameOverFlag) return;
        const positions = levels[currentLevelIndex].tiePositions;
        if (positions.length > 0) {
            let randomIndex = Math.floor(Math.random() * positions.length); // chooses at raandom which tie fighter shoots 
            let tieFighter = positions[randomIndex]; // adds it to the array
            enemyShots.push({ x: tieFighter.x + imageWidth / 2, y: tieFighter.y + imageHeight });// draws tie fighter shots
        }
    }, shootInterval);
}

// draw enemy shots 
function drawEnemyShots() {
    enemyShots.forEach((shot, index) => {
        shot.y += enemyShotSpeed; //moves enemy shot downwards
        context.drawImage(enemyShotImage, shot.x - 5, shot.y, 10, 20);
        //check for collision with X-Wing
        if (shot.x > x && shot.x < x + imageWidth && shot.y + 20 > y && shot.y < y + imageHeight) {
            enemyShots.splice(index, 1);
            xWingLives -= 1;
            if (xWingLives <= 0) gameOver();
        }

        if (shot.y > canvas.height) enemyShots.splice(index, 1); //removes the shot from the array
    });
}

// level up
function levelUp() {
    if (currentLevelIndex < levels.length - 1) {
        currentLevelIndex++; // increments by 1
        resetForNewLevel();        
    } else {
        gameWon();
    }
}


function resetForNewLevel() {
    enemyShots = []; // resets enemy shots
    shootX = null; // stops player shooting
    shootY = null; // stops player shooting
    applyLevelSettings(levels[currentLevelIndex]);//applies new level settings
    startEnemyShooting();
}


// display score and lives
function showScore() {
    context.font = '30px Courier New';
    context.fillStyle = 'white';
    context.fillText('Score: ' + score, canvas.width - 200, 30);
}

// display lives
function showLives() {
    context.font = '30px Courier New';
    context.fillStyle = 'red';
    context.fillText('Lives: ' + xWingLives, 30, 30);
}

// game Over
function gameOver() {
    gameOverFlag = true; // game over
    clearInterval(enemyShootInterval); // clears enemy shots
    clearInterval(gameLoopInterval); // clears the game loop
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '60px Courier New';
    context.fillStyle = 'red';
    context.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);

    saveGameScore(score);
}

//game Won
function gameWon() {
    gameOverFlag = true;
    clearInterval(enemyShootInterval);
    clearInterval(gameLoopInterval);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '60px Courier New';
    context.fillStyle = 'blue';
    context.fillText('You Win!', canvas.width / 2 - 150, canvas.height / 2);

    saveGameScore(score);
}

//save score to local storage
function saveGameScore(score) {
    const username = sessionStorage.getItem('user');
    if (username) {
        // retrieve existing scores from localStorage or newarray
        let scores = JSON.parse(localStorage.getItem('scores')) || [];

        // check if the username already has a score saved
        const existingEntry = scores.find(entry => entry.username === username);

        if (existingEntry) {
            // update the score only if the new score is higher
            if (score > existingEntry.score) {
                existingEntry.score = score;
                console.log(`Updated score for ${username}: ${score}`);
                alert("Score updated successfully!");
            } else {
                console.log(`Existing score for ${username} is higher or equal; no update needed.`);
            }
        } else {
            // add a new entry if the username does not exist in scores
            scores.push({ username, score });
            console.log(`New score of ${score} saved for user ${username}`);
            alert("Score saved successfully!");
        }

        // save the updated scores array back to localStorage
        localStorage.setItem('scores', JSON.stringify(scores));

       
    }
}

//player movement
function movement(event) {
    if (gameOverFlag) return;

    const moveSpeed = 15; // player movement speed

    switch (event.key) {
        case 'ArrowLeft': // move left
            if (x > 0) {
                x -= moveSpeed;
            }
            break;
        case 'ArrowRight': // move right
            if (x + imageWidth < canvas.width) {
                x += moveSpeed;
            }
            break;
        case ' ': // spacebar to shoot at enemies
            if (shootY === null) {
                shootX = x;
                shootY = y;
            }
            break;
    }

    drawCharacter();
}


//updates log in drop down menu
function checkLoginStatus() {
    const username = sessionStorage.getItem('user');

    const loginLink = document.getElementById("loginLink");
    const signUpLink = document.getElementById("signUpLink");
    const loggedInUser = document.getElementById("loggedInUser");
    const logoutLink = document.getElementById("logoutLink");
    const usernameSpan = document.getElementById("username");

    if (username) {
        loginLink.style.display = "none";
        signUpLink.style.display = "none"; 
        loggedInUser.style.display = "block";
        logoutLink.style.display = "block";
        usernameSpan.textContent = username;
    } else {
        loginLink.style.display = "block";
        signUpLink.style.display = "block";  
        loggedInUser.style.display = "none";
        logoutLink.style.display = "none";
        usernameSpan.textContent = "";
    }
}

window.onload = function () {
    xwingImg();
    checkLoginStatus();
};