/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/Monkey_01.png","assets/Monkey_02.png","assets/Monkey_03.png");
  kangaroo_collided = loadAnimation("assets/Monkey_01.png");
  jungleImage = loadImage("assets/jungle.jpg");
  shrub1 = loadImage("assets/banana.png");
  shrub2 = loadImage("assets/banana.png");
  shrub3 = loadImage("assets/banana.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  Monkey = createSprite(50,200,20,50);
  Monkey.addAnimation("running", Monkey_running);
  Monkey.addAnimation("collided", Monkey_collided);
  Monkey.scale = 0.15;
  Monkey.setCollider("circle",0,0,300)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  bananaGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  Monkey.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<100)
    {
       jungle.x=400
    }
   console.log(Monkey.y)
    if(keyDown("space")&& Monkey.y>270) {
      jumpSound.play();
      Monkey.velocityY = -16;
    }
  
    Monkey.velocityY = Monkey.velocityY + 0.8
    spawnBanana();
    spawnObstacles();

    Monkey.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(Monkey)){
      collidedSound.play();
      gameState = END;
    }
    if(bananaGroup.isTouching(Monkey)){
      score = score + 2;
      bananaGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    Monkey.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);

    Monkey.changeAnimation("collided",Monkey_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    Monkey.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);

    Monkey.changeAnimation("collided",Monkey_collided);

    obstaclesGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Score: "+ score, camera.position.x,50);
  
  if(score >= 5){
    Monkey.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congragulations!! You win the game!! ", 70,200);
    gameState = WIN;
  }
}

function spawnBanana() {
 
  if (frameCount % 150 === 0) {

    var banana = createSprite(camera.position.x+500,330,40,10);

    banana.velocityX = -(6 + 3*score/100)
    banana.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: banana.addImage(banana1);
              break;
      case 2: banana.addImage(banana2);
              break;
      case 3: banana.addImage(banana3);
              break;
      default: break;
    }
       
    banana.scale = 0.05;
    banana.lifetime = 400;
    
    banana.setCollider("rectangle",0,0,banana.width/2,banana.height/2)
    bananaGroup.add(banana);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}



function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  Monkey.visible = true;
  Monkey.changeAnimation("running",
               Monkey_running);
  obstaclesGroup.destroyEach();
  bananaGroup.destroyEach();
  score = 0;
}

