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

// create the game and pass it the configuration
var game = new Phaser.Game(config);


function preload() {

    //load images
    this.load.spritesheet('dino', 'assets/DinoSprites - mort.png', {frameWidth: 24, frameHeight: 24});
    this.load.image('ground', 'assets/scrolling ground.png');
    this.load.image('meat', 'assets/meat.34.png');
};

//executed once, after assets are loaded
function create() {

    // ground & creating a group 
    ground = this.physics.add.staticGroup();
    
    ground.create(0, 550, 'ground');
    //ground.setOrigin(0, 0);

    //dino
    console.log('Hey');
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

    // attempt at jumping animation
    // this.anims.create({
    //     key: 'jump',
    //     frames: this.anims.generateFrameNumbers('dino', { start: 5, end: 6 }),
    //     frameRate: 20, 
    //     repeat: -1   
    // });

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
        repeat: 2,
        setXY: { x: 125, y: 0, stepX: Phaser.Math.FloatBetween(125, 250) }
    });

    food.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

    });

    //makes dino land on ground instead of bottom
    this.physics.add.collider(dino, ground);
    //makes food land on ground 
    this.physics.add.collider(food, ground);
    //detecting when dino meets food, setting up function for food collection
    this.physics.add.overlap(dino, food, collectFood, null, this);
    
}

function update (){
    
    // when right arrow key is down 'crouch' animation will meatt
    if (cursors.right.isDown){
        dino.setVelocityX(160);

        dino.anims.play('crouch', true);
    
    // when nothing's pressed, dino doesn't move
    }else {
    dino.setVelocityX(0);

    dino.anims.play('stand');
    }
    //if up arrow is pressed & if dino is on platform, ground, he moves
    if (cursors.up.isDown && dino.body.touching.down){
        dino.setVelocityY(-330);
        //attempted implementation of jump animation
        //dino.anims.play('jump', true);
    }

    
}
//food "body" is made inactive and invisible
function collectFood (dino, meat){
    meat.disableBody(true, true);
}


