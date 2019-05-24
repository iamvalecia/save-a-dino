//our game's configuration
var config = {
    type: Phaser.AUTO, //Phaser will decide how to render the game (webGL or Canvas)
    width: 800, // game width
    height: 600, // game height
    physics: {
            default: 'arcade',
            arcade: {
                //causes the dino to fall from where we created it
                gravity: { y: 300 },
                debug: false
            }
        },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var ground;
var dino;
var cursors;
var food;
var heart;
var health = 10;
var right;
var left;
var up;
var healthText;
var asteroids;
var gameOver = false;
var time;
var timedEvent;
var explosion;



// create the game and pass it the configuration
var game = new Phaser.Game(config);

function preload() {
    //load images
    this.load.spritesheet('dino', 'assets/DinoSprites - mort.png', {frameWidth: 24, frameHeight: 24});
    this.load.image('ground', 'assets/scrolling ground.png');
    this.load.image('meat', 'assets/meat.34.png');
    this.load.spritesheet('heart', 'assets/heart-meter.png', {frameWidth: 164.333, frameHeight: 122});
    this.load.image('asteroid', 'assets/Meteor2.png');
    this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 32, frameHeight: 32});
};

//executed once, after assets are loaded
function create() {

    // create text for Health Meter
    healthText = this.add.text(32, 32, 'Health:', { fontSize: '16px', fill: 'orange',  fontFamily: '"Press asteroidt 2P"', stroke: 'red', strokeThickness: 5, });

    // ground & creating a group 
    ground = this.physics.add.staticGroup();
    ground.create(0, 550, 'ground');
    //ground.setOrigin(0, 0);


    //dino
    //allows us to do things like .setBounce
    dino = this.physics.add.sprite(70, 150, 'dino');

    //scale up
    dino.setScale(2);

    //gives dino a bounce once he lands
    dino.setBounce(0.2);
    
    //keeps dino from walking out of world
    dino.setCollideWorldBounds(true);

    //creating animation, picking frames, for when dino crouches
    this.anims.create({
        key: 'crouch',
        frames: this.anims.generateFrameNumbers('dino', { start: 17, end: 23 }),
        frameRate: 10,
        repeat: -1
    });
    // creating jump animation
    this.anims.create({
        key: 'jump',
        frames: [ { key: 'dino', frame: 6}],
        frameRate: 5, 
        repeat: -1   
    });
    // for when dino is not moving
    this.anims.create({
        key: 'stand',
        frames: [ { key: 'dino', frame: 0 } ],
        frameRate: 20
    });
    // dino die animation
    this.anims.create({
        key: 'die',
        frames: this.anims.generateFrameNumbers('dino', { start: 14, end: 16 }),
        frameRate: 5,
        repeat: -1
    });


    //populates the cursors object with four properties: up, down, left, right,
    cursors = this.input.keyboard.createCursorKeys();


    //creating a group for our food
    food = this.physics.add.group({
        key: 'meat',
        repeat: 2,
        setXY: { x: 125, y: 0, stepX: Phaser.Math.FloatBetween(125, 250) }
    });

    food.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    asteroids = this.physics.add.group();
    
    //signals for asteroids to asteroidt in 5.5 seconds
    timedEvent = this.time.addEvent({ delay: 5500, callback: asteroidDrop, callbackScope: this, loop: true });

    explosion = this.physics.add.sprite();
    

    //creating heart meter
    heart = this.physics.add.sprite(160, 30, 'heart');
    heart.setScale(.25)
    heart.setOrigin(0, 0);
    // this sets the gravity for heart specifically
    heart.body.setAllowGravity(false);
    //health meter animation
    this.anims.create({
        key: 'fullHealth',
        frames: [ { key: 'heart', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'halfHealth',
        frames: [ { key: 'heart', frame: 1 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'noHealth',
        frames: [ { key: 'heart', frame: 2 } ],
        frameRate: 20,
    });

    

    //makes dino land on ground instead of bottom
    this.physics.add.collider(dino, ground);
    //makes food land on ground 
    this.physics.add.collider(food, ground);
    this.physics.add.collider(asteroids, ground, asteroidExplosion, null, this);
    this.physics.add.collider(explosion, ground);
    this.physics.add.collider(dino, asteroids, hitByAsteroids, null, this);
    //detecting when dino meets food, setting up function for food collection
    this.physics.add.overlap(dino, food, collectFood, null, this);
    }

function update (){


//if gameOver this keeps dino from running in place

    if (gameOver)
    {
        //this stops asteroids from recreating
        timedEvent.paused = true;
        return dino.anims.play('die');
    }
    
    left = cursors.left.isDown
    right = cursors.right.isDown
    up = cursors.up.isDown 

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
    // when right arrow key is down 'crouch' animation will meat
    if (right) {
        dino.setVelocityX(160);

        dino.anims.play('crouch', true);
    
    }
    //if up arrow is pressed & if dino is on platform/ground, he moves
    if (up && dino.body.touching.down){
        dino.setVelocityY(-330);
        dino.anims.play('jump', true);
    }
    // when nothing's pressed, dino doesn't move
    if (!(up) && (!(right)) && (!(left))) {
    dino.setVelocityX(0);

    dino.anims.play('stand');
    }
    
    if (health === 10){
        heart.anims.play('noHealth');

    }
    if (health === 12){
        heart.anims.play('halfHealth');
    }
    if (health == 13 ){
    //if (!(health === 10) && (!(health === 12))){
        heart.anims.play('fullHealth');
    }
    
}


//food "body" is made inactive and invisible
function collectFood (dino, meat){
    meat.disableBody(true, true);
    health += 1;
}
//called during timedEvent via addEvent method in create function
function asteroidDrop(){
    var x = (dino.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    var asteroid = asteroids.create(x, 16, 'asteroid');
    asteroid.setVelocity(Phaser.Math.Between(-200, 200), 20);
}
//
function hitByAsteroids (dino, asteroids){
    this.physics.pause();
    //dino turns red
    dino.setTint(0xff0000);
    gameOver = true;
}
//
function asteroidExplosion (asteroid, ground) {
    console.log(1-8);
    asteroid.disableBody(true, true);
    var x = asteroid.x;
    var y = asteroid.y;
    //this(below) doesn't work here either
    //this.physics.add.collider(explosion, ground);
    explosion = this.physics.add.sprite(x, y, 'explosion');
    explosion.setScale(3);
    

}