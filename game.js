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

var dino;
var cursors;

// create the game and pass it the configuration
var game = new Phaser.Game(config);


function preload() {

    //load images
    this.load.spritesheet('dino', 'assets/DinoSprites - mort.png', {frameWidth: 24, frameHeight: 24});
    this.load.image('ground', 'assets/scrolling ground.png');
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
    dino = this.physics.add.sprite(100, 150, 'dino');

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
    //     frameRate: 10, 
    //     repeat: -1   
    // });

    // for when dino is not moving
    this.anims.create({
        key: 'stand',
        frames: [ { key: 'dino', frame: 0 } ],
        frameRate: 20
    });

    cursors = this.input.keyboard.createCursorKeys();
    //makes dino land on ground instead of bottom
    this.physics.add.collider(dino, ground);
    
}

function update (){
    
    // when right arrow key is down 'crouch' animation will start
    if (cursors.right.isDown){
        dino.setVelocityX(160);

        dino.anims.play('crouch', true);

    }
    // when nothing's pressed, dino doesn't move
    else {
    dino.setVelocityX(0);

    dino.anims.play('stand');
    }
    //if up arrow is pressed dino moves
    //only when he's on a platform, ground
    if (cursors.up.isDown && dino.body.touching.down){
        dino.setVelocityY(-330);
        //attempted implementation of jump animation
        //dino.anims.play('jump', true);
    }

}

