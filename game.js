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
        // init: init,
        preload: preload,
        create: create,
        update: update
    }
};


var dino;
var food;
var counter = 1;
var cursors;
var lifeYears = 1;
var right;
var left;
var up;
var lifeYearsText;
var gameOver = false;
var smallAsteroids;
var bigAsteroid;

var bigAsteroidReverse;
//considering variables
// var initBigAsteroidGrav = ;
// var reverseBigAsteroidGrav = ;


// create the game and pass it the configuration
var game = new Phaser.Game(config);



function preload() {
    //load images
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('dino', 'assets/DinoSprites - mort.png', {frameWidth: 24, frameHeight: 24});
    this.load.image('food', 'assets/meat.34.png');
    this.load.image('asteroid', 'assets/meteor2.png');
    this.load.image('bigAsteroid', 'assets/meteor1.png')
    };

//executed once, after assets are loaded
function create() {

    //background
    let bg = this.add.sprite(0, 0, 'background');

    //change origin of background sprite, notice bg variable
    bg.setOrigin(0, 0);

    //player
    dino = this.physics.add.sprite(40, this.sys.game.config.height /2, 'dino')

    

    food = this.physics.add.sprite(this.sys.game.config.width - 70, this.sys.game.config.height / 2, 'food');

    

    // create text for Health Meter
    lifeYearsText = this.add.text(32, 32, 'Life Years: ' + lifeYears, { fontSize: '16px', fill: 'orange',  fontFamily: '"Press Start 2P"', stroke: 'red',
    strokeThickness: 5, });

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


    //populates the cursors object with four properties: up, down, left, right,
    cursors = this.input.keyboard.createCursorKeys();


    

    this.physics.add.overlap(dino, food, collectfood, null, this);

    // creating the asteroid group
    smallAsteroids = this.physics.add.group({
        key: 'asteroid',
        repeat: 3,
        setXY: {
            x: 110,
            y: -100,
            stepX: 80,
            stepY: 20
        },
        //did not care about using capital A
        allowGravity: true,
        gravityY: 350
    });

    bigAsteroid = this.physics.add.sprite(520, -15, 'bigAsteroid');
    bigAsteroid.body.setAllowGravity(true);
    bigAsteroid.setGravityY(350);

       
    bigAsteroidReverse = this.time.addEvent({ delay: 1600, callback: bigAsteroidGravityChange, callbackScope: this, loop: true });
    smallAsteroidsReverse = this.time.addEvent({ delay: 1900, callback: smallAsteroidsGravityChange, callbackScope: this, loop: true });
    

    this.physics.add.overlap(dino, bigAsteroid, hitByBigAsteroid, null, this);
    this.physics.add.overlap(dino, smallAsteroids, hitBySmallAsteroid, null, this);
}

function update (time){
    left = cursors.left.isDown
    right = cursors.right.isDown

//if left arrow is pressed and dino is faced right, make him face left
    if (left && dino.flipX == false){
        dino.flipX = !dino.flipX;
        
    }
//if right arrow is pressed and dino is facing left, make him face right    
    if (right && dino.flipX == true) {
        dino.flipX = !dino.flipX;
        
    }
//if dino is already faced left, make him move left
    if (left){
        dino.setVelocityX(-160);

        dino.anims.play('crouch', true);
        
    }
// when right arrow key is down 'crouch' animation 
    if (right) {
        dino.setVelocityX(160);
        
        dino.anims.play('crouch', true);
    }
    
    // when nothing's pressed, dino doesn't move
    if ((!(right)) && (!(left))) {
    dino.setVelocityX(0);

    dino.anims.play('stand');
    }    
}
    

//end the game, currently not working and not in use
this.gameOver = function() {
    //restart the scene
    this.scene.restart();
}

function collectfood (dino, food) {
    food.disableBody(true, true);
//only want there to be a total of 10 food collections
    if (counter === 10 ) {
        //this.gameOver();
        return;
    } else{
    var x = food.x;
    
//sends food to the opposite side of screen
    if (x === 570) {
        x = 40;
    }else{
        x = 570;
    }

    food.enableBody(true, x, this.sys.game.config.height / 2, true, true);
//tracks how many food has been distributed    
    counter += 1;
//updates score on food collection
    lifeYears = lifeYears + 3;
    lifeYearsText.setText('Life Years: ' + lifeYears);
   }
    
}

//getting asteroids to reverse
function bigAsteroidGravityChange() {
    //with some test variables/code (following 2-3 lines)
    var  bigG = bigAsteroid.body.gravity.y;
    console.log(bigG);
    if (bigG > 1) {
        bigAsteroid.setGravityY(-350);
        bigAsteroid.setVelocityY(-160);
    } else {
        bigAsteroid.setGravityY(350);
        bigAsteroid.setVelocityY(160);
    }
//^ after a while this loop leads the bigAsteroid not going off screen before it reverses
// will check standard length of game to see affects
}

function smallAsteroidsGravityChange() {

    smallAsteroids.children.iterate(function (child) {

        var g  = child.body.gravity.y

    
        if (g > 1) {
            child.setGravityY(-350);
            child.setVelocityY(-100);
        } else {
            child.setGravityY(350);
            child.setVelocityY(100);
        }
    });
}

function hitByBigAsteroid(dino, bigAsteroid) {
    dino.setTint(0xff0000);
    this.cameras.main.shake(500);
    //dino.setTint(0xffffff);
    this.time.delayedCall(500, function() { dino.clearTint()},[], this);
//this keeps score from updating as asteroid slides over dino
    bigAsteroid.disableBody(true, true);
    bigAsteroid.enableBody(true, 520, -15, true, true);
// calling this function interrupts or contradicts the bigAsteroidReverse but test affects
    bigAsteroidGravityChange();

//update score everytime dino is hit
    lifeYears = lifeYears - 5;
    lifeYearsText.setText('Life Years: ' + lifeYears);
}

//result of dino getting hit by a small asteroid
//really needs work, worse than bigAsteroid, perhaps create small asteroids separately
function hitBySmallAsteroid(dino, smallAsteroids) {
    dino.setTint(0xff0000);
    this.cameras.main.shake(500);
    this.time.delayedCall(500, function() { dino.clearTint()},[], this);
    var x = smallAsteroids.x;
    var i = (x-110) / 80 
    var y = (i*20) + -100;
    var g = smallAsteroids.body.gravity.y;
    smallAsteroids.disableBody(true, true);
    smallAsteroids.enableBody(true, x, y, true, true);
    smallAsteroidsGravityChange();

    lifeYears = lifeYears - 1;
    lifeYearsText.setText('Life Years: ' + lifeYears);
}


