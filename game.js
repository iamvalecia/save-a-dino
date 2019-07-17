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


// create the game and pass it the configuration
var game = new Phaser.Game(config);

function preload() {
    //load images
    this.load.spritesheet('dino', 'assets/DinoSprites - mort.png', {frameWidth: 24, frameHeight: 24});
    this.load.image('ground', 'assets/scrolling ground.png');
    this.load.image('meat', 'assets/meat.34.png');
    this.load.spritesheet('heart', 'assets/heart-meter.png', {frameWidth: 164.333, frameHeight: 122});
};

//executed once, after assets are loaded
function create() {

    // create text for Health Meter
    healthText = this.add.text(32, 32, 'Health:', { fontSize: '16px', fill: 'orange',  fontFamily: '"Press Start 2P"', stroke: 'red',
    strokeThickness: 5, });


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


    //populates the cursors object with four properties: up, down, left, right,
    cursors = this.input.keyboard.createCursorKeys();


    //creating a group for our food
    food = this.physics.add.group({
        key: 'meat',
        repeat: 0,
        //x : (dino.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400),
        //y : (x),
        //if dino.x < 400 then x will be Phaser.Math.Between(400, 800) else x will be Phaser.Math.Between(0, 400)
        setXY: { x: (dino.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400), y: 0 }
    });

    food.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });


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
    //detecting when dino meets food, setting up function for food collection
    this.physics.add.overlap(dino, food, collectFood, null, this);
    }

function update (){
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
    //test code for health meter
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



//fail it doesn't care about the delay
// function foodDestroy(meat, ground) {
//     if ({delay : 20500}) {
//         meat.destroy();
//         meat = null;
//     }
// }