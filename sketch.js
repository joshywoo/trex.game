var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameIsOver = loadImage ("gameOver.png")
  resetButton = loadImage ("restart.png")

  die= loadSound("die.mp3")
  jump = loadSound ("jump.mp3")
  checkpoint = loadSound ("checkpoint.mp3")

  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(80,height -200,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 1;
  trex.debug = false
  trex.setCollider ("circle", 0 , 0 , 50)
  
  ground = createSprite(width/2,height- 150,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,height-130,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;

  gameOver= createSprite (width/2,height/2)
  gameOver.addImage (gameIsOver)
  
  restart = createSprite (width/2, height/2+50)
  restart.addImage (resetButton)
  restart.scale = 0.7
}

function draw() {
  background("lightBlue");
  noStroke ()
  fill ("lightGreen")
  rect (0,height-155,width,200)
  //displaying score
  fill ("black")
  textSize (20)
  text("Score: "+ score, width-150,50);
  
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4 + score/ 100);
    gameOver.visible = false
    restart.visible = false 
    //scoring
    score = score + Math.round(getFrameRate ()/60);
    
    if (score % 500 == 0 && score > 0 ) {
      checkpoint.play ()

    }

    if (ground.x < 680){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length > 0 ||keyDown("space")&& trex.y >= height-200) {
        trex.velocityY = -20;
        jump.play ()
        touches = []
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      die.play ()
        gameState = END;
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach (-2)
     cloudsGroup.setLifetimeEach (-2)

    trex.changeAnimation ("collided")

    gameOver.visible = true
    restart.visible = true

    trex.velocityY = 0

    if (mousePressedOver (restart)||touches.length > 0) {
     reset ()
     touches= []
    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function reset () {
  gameState = PLAY
  cloudsGroup.destroyEach ()
  obstaclesGroup.destroyEach ()
  trex.changeAnimation ("running")
  score = 0
  
}

function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(width,height-180,10,40);
   obstacle.velocityX = -(4 + score/ 100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 1000;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);

    restart.depth += obstacle.depth
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width,100,40,10);
    cloud.y = Math.round(random(50,150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

