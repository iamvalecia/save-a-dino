//our game's configuration
var config = {
    type: Phaser.AUTO, //Phaser will decide how to render the game (webGL or Canvas)
    width: 640, // game width
    height: 360, // game height
    physics: {
        default: 'arcade',
        arcade: {
            //causes the dino to fall from where we created it
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var dino;
var food;
var foodCollected;
var cursors;
var lifeYears;
var lifeYearsText;
var gameOver;
var smallAsteroids;
var bigAsteroid;
var bg;
var gameOverText;
var foodCollectedText;
var winOrLoseText;


// create the game and pass it the configuration
var game = new Phaser.Game(config);

function preload() {
    //load images
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('dino', 'assets/DinoSprites - mort.png', {frameWidth: 24, frameHeight: 24});
    this.load.image('food', 'assets/meat.34.png');
    this.load.image('asteroid', 'assets/Meteor2.png');
    this.load.image('bigAsteroid', 'assets/Meteor1.png');
}

//executed once, after assets are loaded
function create() {

    foodCollected = 0;
    //changed it to 0 for more challenge
    lifeYears = 0;
    gameOver = false;

    //background
    bg = this.add.sprite(0, 0, 'background');

    //change origin of background sprite, notice bg variable
    bg.setOrigin(0, 0);
    
    //player
    dino = this.physics.add.sprite(40, this.sys.game.config.height /2, 'dino');

    food = this.physics.add.sprite(this.sys.game.config.width - 70, this.sys.game.config.height / 2, 'food');

    // create text for Life Year
    lifeYearsText = this.add.text(22, 22, 'Life Years: ' + lifeYears, { fontSize: '10px', fill: 'white',  fontFamily: '"Press Start 2P"', stroke: 'red', strokeThickness: 1, });

    //scale up
    dino.setScale(2);

    //keeps dino from walking out of world
    dino.setCollideWorldBounds(true);

     //creating animation, picking frames, for when dino crouches
     this.anims.create({
        key: 'crouch',
        frames: this.anims.generateFrameNumbers('dino', { start: 17, end: 23 }),
        frameRate: 10,
        repeat: -1
    });
    
    // for when dino is not moving
    this.anims.create({
        key: 'stand',
        frames: [ { key: 'dino', frame: 0 } ],
        frameRate: 20
    });

    // for when dino is dead
    this.anims.create({
        key: 'dead',
        frames: [ { key: 'dino', frame: 16 } ],
        frameRate: 20
    });

    // for when dino wins
    this.anims.create({
        key: 'win',
        frames: [ { key: 'dino', frame: 7 } ],
        frameRate: 20
    });

    //populates the cursors object with four properties: up, down, left, right,
    cursors = this.input.keyboard.createCursorKeys();

    // creating the asteroid group
    smallAsteroids = this.physics.add.group({
        key: 'asteroid',
        repeat: 3,
        setXY: {
    //the first smallAsteroid has the x and y coordinates (120, -100)
            x: 120,
            y: -100,
    //the next one is 90x and 20y over
            stepX: 90,
            stepY: 20
        },
        allowGravity: true,
        gravityY: 350,
        setVelocityY: 100
    });

    bigAsteroid = this.physics.add.sprite(520, -15, 'bigAsteroid');
    bigAsteroid.body.setAllowGravity(true);
    bigAsteroid.setGravityY(350);
    
    //these timed events run on a loop
    bigAsteroidReverse = this.time.addEvent({ delay: 1600, callback: bigAsteroidGravityChange, callbackScope: this, loop: true });
    smallAsteroidsReverse = this.time.addEvent({ delay: 1900, callback: smallAsteroidsGravityChange, callbackScope: this, loop: true });
    
    this.physics.add.overlap(dino, smallAsteroids, hitBySmallAsteroid, null, this);
    this.physics.add.overlap(dino, bigAsteroid, hitByBigAsteroid, null, this);
    this.physics.add.overlap(dino, food, collectfood, null, this);
}

function update (){
//if game is over then dino is completely frozen
    if (gameOver) {
        return;
    }

    var left = cursors.left.isDown;
    var right = cursors.right.isDown;

//if left arrow is pressed and dino is faced right, make him face left
    if (left && dino.flipX == false){
        dino.flipX = !dino.flipX;
    }
//if right arrow is pressed and dino is facing left, make him face right    
    if (right && dino.flipX == true) {
        dino.flipX = !dino.flipX;
    }
//if left arrow is pressed and dino is faced left
    if (left){
        dino.setVelocityX(-160);
        dino.anims.play('crouch', true);
    }
//if right arrow is pressed and dino is faced right 
    if (right) {
        dino.setVelocityX(160);
        dino.anims.play('crouch', true);
    }
// when nothing's pressed, dino doesn't move
    if (!right && !left) {
    dino.setVelocityX(0);
    dino.anims.play('stand');
    }   
    
    if (lifeYears <= -1)  {
        gameOver = true;
        this.physics.pause();
        dino.setTint(0xff0000); //red
        bg.setVisible(false);
        dino.anims.play('dead');
    }

    if (foodCollected === 10) {
        this.physics.pause();
        dino.anims.play('win');
        gameOver = true;
    }

//writes new text on game canvas
    if (gameOver) {
        gameOverText = this.add.text(202, 52, 'GAME OVER', { fontSize: '26px', fill: 'orange',  fontFamily: '"Press Start 2P"', stroke: 'red', strokeThickness: 5});
        foodCollectedText = this.add.text(21, 132, 'You captured ' + foodCollected + ' out of 10 food sources', { fontSize: '16px', fill: 'orange',  fontFamily: '"Press Start 2P"', stroke: 'red', strokeThickness: 5}); 
        if (foodCollected === 10) {
            winOrLoseText = this.add.text(45, 207, 'YOU WIN! And Survive a Generation', { fontSize: '16px', fill: 'orange',  fontFamily: '"Press Start 2P"', stroke: 'red', strokeThickness: 5});
        }else{
            winOrLoseText = this.add.text(152, 207, 'YOU LOSE and PERISH!!!', { fontSize: '16px', fill: 'orange',  fontFamily: '"Press Start 2P"', stroke: 'red', strokeThickness: 5});
        }
        this.time.delayedCall(5000, function() {
            this.cameras.main.fadeOut(3000);
        }, [], this);
        this.time.delayedCall(8000, function() {
            this.scene.restart();
        }, [], this);
    }
}

function collectfood (dino, food) {
    food.disableBody(true, true);
//tracks how many food dino has collected 
    foodCollected += 1;
//only want there to be a total of 10 food distributions
    if (foodCollected < 10 ) {
        var foodX = food.x;
//sends food to the opposite side of screen
        if (foodX === 570) {
            foodX = 40;
        }else{
            foodX = 570;
        }
    food.enableBody(true, foodX, this.sys.game.config.height / 2, true, true);     
//updates score on food collection
    lifeYears = lifeYears + 3;
    lifeYearsText.setText('Life Years: ' + Math.ceil(lifeYears)); 
    }
}

//getting asteroids to reverse
//this function is called every 1.6 seconds
function bigAsteroidGravityChange() {
    var  bigAsteroidGravity = bigAsteroid.body.gravity.y;
    if (bigAsteroidGravity > 1) {
        bigAsteroid.setGravityY(-350);
        bigAsteroid.setVelocityY(-160);
    } else {
        bigAsteroid.setGravityY(350);
        bigAsteroid.setVelocityY(160);
    }
/* ^ after a while this loop leads the bigAsteroid not going off screen before it reverses
will check standard length of game to see affects */
}

//this function is called every 1.9 seconds
function smallAsteroidsGravityChange() {
    smallAsteroids.children.iterate(function (child) {
        var smallAsteroidGravity  = child.body.gravity.y;
        if (smallAsteroidGravity > 1) {
            child.setGravityY(-350);
            child.setVelocityY(-100);
        } else {
            child.setGravityY(350);
            child.setVelocityY(100);
        }
    });
}

function hitByBigAsteroid(dino, bigAsteroid) {
    this.cameras.main.shake(500);
//this keeps score from updating as asteroid slides over dino
    bigAsteroid.disableBody(true, true);
    bigAsteroid.enableBody(true, 520, -15, true, true);
// calling this function helps the bigAsteroid movements behave longer
    bigAsteroidGravityChange();
//update score everytime dino is hit
    lifeYears = lifeYears - 5;
    lifeYearsText.setText('Life Years: ' + Math.ceil(lifeYears));
}

//result of dino getting hit by a small asteroid
function hitBySmallAsteroid(dino, smallAsteroids) {
    this.cameras.main.shake(500);
// this math compensates for asteroid-dino overlap
    lifeYears = lifeYears - 0.14; 
    lifeYearsText.setText('Life Years: ' + Math.ceil(lifeYears));
}