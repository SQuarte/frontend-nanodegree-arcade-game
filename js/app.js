var MAXIMUM_SPEED = 500;
var MINIMUM_SPEED = 100;

var ENEMY_NUMBER = 4;


//Constants which describes game field and so on
var gameInfo = {
    colNumber: 6,
    rowNumber: 6,
    gridCellWidth: 101,
    gridCellHeight: 83
};
gameInfo.canvasWidth = gameInfo.colNumber * gameInfo.gridCellWidth;
gameInfo.canvasHeight = 60 + gameInfo.gridCellHeight * gameInfo.rowNumber;


// Enemies our player must avoid
var Enemy = function(initColumn) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    if (initColumn === undefined || !Number.isInteger(initColumn)) {
        initColumn = Math.floor(Math.random() * (gameInfo.rowNumber - 3));
    }

    this.x = Math.random() * gameInfo.canvasWidth;
    this.y = 60 + gameInfo.gridCellHeight * initColumn;
    this.speed = Math.random() * (MAXIMUM_SPEED - MINIMUM_SPEED) + MINIMUM_SPEED;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > gameInfo.canvasWidth * 2) {
        this.x = -gameInfo.gridCellWidth;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player you control
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = Math.round(gameInfo.colNumber / 2) * gameInfo.gridCellWidth;
    this.y = 60 + gameInfo.gridCellHeight * (gameInfo.rowNumber - 2);
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Process different keys to move your player
Player.prototype.handleInput = function(key) {
    var dirX = 0,
        dirY = 0;

    switch (key) {
        case 'left':
            dirX = -gameInfo.gridCellWidth;
            break;
        case 'right':
            dirX = gameInfo.gridCellWidth;
            break;
        case 'up':
            dirY = -gameInfo.gridCellHeight;
            break;
        case 'down':
            dirY = gameInfo.gridCellHeight;
            break;
    }

    //check player on game field by X coordinate
    if ((this.x + dirX) >= 0 && (this.x + dirX) < gameInfo.canvasWidth) {
        this.x += dirX;
    }
    //check player on game field by X coordinate
    if ((this.y + dirY) >= 0 && (this.y + dirY) < (gameInfo.canvasHeight - gameInfo.gridCellHeight)) {
        this.y += dirY;
    } else if ((this.y + dirY) < 0) {
        //player has reached oposite side of game field
        upScore(1);
        this.resetPosition();
    }
};

//Update playe position and check collisions between player and enemies
Player.prototype.update = function() {
    if (this.checkEnemyCollision()) {
        //Collide with enemy
        downScore(2);
        this.resetPosition();
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Check collision berween player and enemies. True if collision happened,false otherwise
Player.prototype.checkEnemyCollision = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        if (this.x < enemy.x + 80 &&
            this.x + 80 > enemy.x &&
            this.y < enemy.y + 80 &&
            this.y + 80 > enemy.y) {
            return true;
        }
    }
    return false;
};


//Return player to the started position
Player.prototype.resetPosition = function() {
    this.x = Math.round(gameInfo.colNumber / 2) * gameInfo.gridCellWidth;
    this.y = 60 + gameInfo.gridCellHeight * (gameInfo.rowNumber - 2);
};

//Bonuses which you should pick up for additional scores.
// Parameter: createdTick, tick when bonus had been created.
var Bonus = function(createdTick) {
    this.createdTick = createdTick;
    this.x = Math.floor(Math.random() * gameInfo.colNumber) * 101;
    this.y = 60 + gameInfo.gridCellHeight * Math.floor(Math.random() * (gameInfo.rowNumber - 3));
    this.sprite = 'images/gem-orange.png';
};

// Draw the bonus on the screen, required method for game.
Bonus.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update bonus on screen
// Parameter: dt, a time delta between ticks
// Parameter: tick, current tick of a game
Bonus.prototype.update = function(dt, tick) {
    var bonus = this;
    if (this.checkPlayerCollision()) {
        //Collision between player and bonus happened,add score to global score and remove this bonus.
        upScore(bonus.score);
        removeBonus(bonus);
    } else if (!this.checkIsAlive(tick)) {
        //Lifetime of bonus ended. Must remove this bonus from game
        removeBonus(bonus);
    }
};


//Check collision between player and bonus
Bonus.prototype.checkPlayerCollision = function() {
    if (this.x < player.x + 80 &&
        this.x + 80 > player.x &&
        this.y < player.y + 80 &&
        this.y + 80 > player.y) {
        return true;
    } else {
        return false;
    }
};

//Check lifetime status of bonus.
Bonus.prototype.checkIsAlive = function(currentTick) {
    return this.createdTick + this.lifetimeTicks > currentTick;
};

//Remove bonus from game.
function removeBonus(bonus) {
    var bonusIndex = allBonuses.findIndex(function(item) {
        return item == bonus;
    });
    allBonuses.splice(bonusIndex, 1);
}

//Bonus pseudo subclass.
var WeakBonus = function(createdTick) {
    Bonus.call(this, createdTick);
    this.lifetimeTicks = 300;
    this.score = 1;
    this.sprite = 'images/gem-green.png';
};
WeakBonus.prototype = Object.create(Bonus.prototype);
WeakBonus.prototype.constructor = WeakBonus;

//Bonus pseudo subclass.
var StrongBonus = function(createdTick) {
    Bonus.call(this, createdTick);
    this.lifetimeTicks = 150;
    this.score = 2;
    this.sprite = 'images/gem-blue.png';
};
StrongBonus.prototype = Object.create(Bonus.prototype);
StrongBonus.prototype.constructor = StrongBonus;

//Bonus pseudo subclass.
var StrongestBonus = function(createdTick) {
    Bonus.call(this, createdTick);
    this.lifetimeTicks = 50;
    this.score = 5;
    this.sprite = 'images/gem-orange.png';
};
StrongestBonus.prototype = Object.create(Bonus.prototype);
StrongestBonus.prototype.constructor = StrongestBonus;

//Create random bonus,choosing from 3 types.
// Parameter: createdTick, current tick of a game
var createRandomBonus = function(createdTick) {
    var random = Math.floor((Math.random() * 10));
    if (random < 5) {
        return new WeakBonus(createdTick);
    } else if (random > 7) {
        return new StrongestBonus(createdTick);
    } else {
        return new StrongBonus(createdTick);
    }
};


var allEnemies;
var allBonuses;
var player;
//Initialize player,starter bonus and enemies.
(function initGameObjects() {
    var i;
    allEnemies = [];
    allBonuses = [createRandomBonus(0)];
    for (i = 0; i < 3; i++) {
        allEnemies.push(new Enemy(i));
    }
    for (i = 0; i < ENEMY_NUMBER - 3; i++) {
        allEnemies.push(new Enemy());
    }
    player = new Player();
})();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Global game score
var gameScore = 0;

//Add score to global score
// Parameter: step, a score which addы to global score 
function upScore(step) {
    if (step === undefined || !Number.isInteger(step)) {
        step = 1;
    }
    gameScore += step;
}


//Subtract score from global score
// Parameter: step, a score which substracts from global score 
function downScore(step) {
    if (step === undefined || !Number.isInteger(step)) {
        step = 1;
    }
    gameScore -= step;
}