var MAXIMUM_SPEED = 500;
var MINIMUM_SPEED = 100;

var ENEMY_NUMBER = 4;

var gameInfo = {
        colNumber : 6,
        rowNumber : 6,
        gridCellWidth : 101,
        gridCellHeight : 83
 };
 gameInfo.canvasWidth = gameInfo.colNumber * gameInfo.gridCellWidth;
 gameInfo.canvasHeight = 60  + gameInfo.gridCellHeight * gameInfo.rowNumber;

// Enemies our player must avoid
var Enemy = function(initColumn) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    if (initColumn === undefined || !Number.isInteger(initColumn)){
    	initColumn = Math.floor(Math.random() * (gameInfo.rowNumber - 3));
    }

    this.x = Math.random() * gameInfo.canvasWidth;;
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.sprite = 'images/char-boy.png';
	this.x = Math.round(gameInfo.colNumber / 2) * gameInfo.gridCellWidth ;
	this.y = 60 + gameInfo.gridCellHeight * (gameInfo.rowNumber - 2);
}

Player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function (key) {
	var dirX = 0,dirY = 0;
	switch (key) {
		case 'left': dirX = -gameInfo.gridCellWidth; break;
		case 'right': dirX = gameInfo.gridCellWidth; break;
		case 'up': dirY = -gameInfo.gridCellHeight; break;
		case 'down': dirY = gameInfo.gridCellHeight; break;
	}

	if ((this.x + dirX) >= 0 && (this.x + dirX) < gameInfo.canvasWidth){
		this.x += dirX;
	} 
	if ((this.y + dirY) >= 0 && (this.y + dirY) < (gameInfo.canvasHeight - gameInfo.gridCellHeight)){
		this.y += dirY;
	} 
}

Player.prototype.update = function() {
}


Player.prototype.render = function() {
	if (this.checkCollision()){
		this.resetPosition();
	}
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.checkCollision = function() {
	for (var i = 0; i < allEnemies.length; i++){
		var enemy = allEnemies[i];
		if (this.x < enemy.x + 80 &&
			this.x + 80 > enemy.x &&
			this.y < enemy.y + 80 &&
			this.y + 80 > enemy.y ) {
			return true;
		}
	}
	return false;
}

Player.prototype.resetPosition = function() {
	this.x = Math.round(gameInfo.colNumber / 2) * gameInfo.gridCellWidth ;
	this.y = 60 + gameInfo.gridCellHeight * (gameInfo.rowNumber - 2);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies;
var player;

(function initGameObjects(){
	allEnemies = [];
	for (var i = 0; i < 3; i++){
		allEnemies.push(new Enemy(i));
	}
	for (var i = 0; i < ENEMY_NUMBER -3; i++){
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
