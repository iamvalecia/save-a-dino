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
var counter = 1;
var cursors;
var lifeYears = 1;
var right;
var left;
var up;
var healthText;
var gameOver = false;
var smallMeteors;
var bigMeteor;


// create the game and pass it the configuration
var game = new Phaser.Game(config);



function preload() {
    //load images
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('dino', 'assets/DinoSprites - mort.png', {frameWidth: 24, frameHeight: 24});
    this.load.image('food', 'assets/meat.34.png');
    this.load.image('meteor', 'assets/Meteor2.png');
    this.load.image('bigMeteor', 'assets/Meteor1.png')
    };

//executed once, after assets are loaded
function create() {

    //background
    let bg = this.add.sprite(0, 0, 'background');

    //change origin of background sprite, notice bg variable
    bg.setOrigin(0, 0);

    //player
    dino = this.physics.add.sprite(40, this.sys.game.config.height /2, 'dino')

    food = this.physics.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'food');

    

    // create text for Health Meter
    healthText = this.add.text(32, 32, 'Health:', { fontSize: '16px', fill: 'orange',  fontFamily: '"Press Start 2P"', stroke: 'red',
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

    // creating the meteor group
    smallMeteors = this.add.group({
        key: 'meteor',
        repeat: 3,
        setXY: {
            x: 110,
            y: 100,
            stepX: 80,
            stepY: 20
        }
    });

    bigMeteor = this.add.sprite(520, -15, 'bigMeteor')

    
    
}

function update (){
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
        //dino.x += -this.dinoSpeed;
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
    if (counter === 10 ) {
        //this.gameOver();
        return;
    } else{
    var x = food.x;
    lifeYears = lifeYears + 3;

    if (x === 560) {
        x = 40;
    }else{
        x = 560;
    }

    food.enableBody(true, x, this.sys.game.config.height / 2, true, true);
    
    counter += 1;
   }
    
}

