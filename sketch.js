var Trex, TrexRunning, TrexColide;
var edges;
var ground, groundImg;
var ground2;
var cloudImg;

var obstacle1;
var obstacle2;
var obstacle3;
var obstacle4;
var obstacle5;
var obstacle6;

var cloudGroup, obstaclesGroup;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOver, gameOverImg;
var restart, restartImg;
var score = 0;

var checkpointSound;
var dieSound;
var jumpSound;

//preload carrega as midías do jogo
function preload() {
  TrexRunning = loadAnimation('trex1.png', 'trex3.png', 'trex4.png');

  TrexColide = loadAnimation('trex_collided.png');

  groundImg = loadImage('ground2.png');

  cloudImg = loadImage('cloud.png');

  obstacle1 = loadImage('obstacle1.png');
  obstacle2 = loadImage('obstacle2.png');
  obstacle3 = loadImage('obstacle3.png');
  obstacle4 = loadImage('obstacle4.png');
  obstacle5 = loadImage('obstacle5.png');
  obstacle6 = loadImage('obstacle6.png');

  gameOverImg = loadImage('gameOver.png');
  restartImg = loadImage('restart.png');

  checkpointSound = loadSound('checkpoint.mp3');
  dieSound = loadSound('die.mp3');
  jumpSound = loadSound('jump.mp3');
}
//setup faz a aconfiguração
function setup() {
  createCanvas(windowWidth, windowHeight);

  edges = createEdgeSprites();

  // criando as bordas
  Trex = createSprite(50, 170, 10, 10);

  Trex.addAnimation('running', TrexRunning);
  Trex.addAnimation('collided', TrexColide);
  Trex.scale = 0.5;

  Trex.setCollider('circle', 0, 0, 40);
  Trex.debug = false;

  ground = createSprite(300, 180, 600, 2);
  ground.addImage('ground', groundImg);

  ground2 = createSprite(300, 190, 600, 2);
  ground2.visible = false;

  //sprite game over
  gameOver = createSprite(width /2 , 80);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;

  //sprite restart
  restart = createSprite(width /2 , 130);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  cloudGroup = new Group();
  obstaclesGroup = new Group();
}

//draw faz o movimento, a ação do jogo
function draw() {
  background('#f0f9f7');

  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //pontuacao
    score += Math.round(World.frameRate / 60);

    if (score > 0 && score % 600 === 0) {
      checkpointSound.play();
    }

    //console.log(Trex.y)
    if ((touches.length > 0 || keyDown('space')) && Trex.y > 160) {
      Trex.velocityY = -12;
      jumpSound.play();
      touches = [];
    }
    ground.velocityX = -(4 * 3);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    gravity();
    criarNuvens();
    criarObstaculos();

    if (obstaclesGroup.isTouching(Trex)) {
      dieSound.play();
      gameState = END;
    }
  } else if (gameState === END) {
    Trex.velocityY = 0;
    Trex.changeAnimation('collided');
    ground.x = 0;
    obstaclesGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);

    gameOver.visible = true;
    restart.visible = true;

    if (touches.length > 0 || mousePressedOver(restart)) {
      reset();
      touches = [];
    }
  }

  Trex.collide(ground2);

  //coordenadas do mouse na tela
  text('X: ' + mouseX + '/ Y: ' + mouseY, mouseX, mouseY);

  drawSprites();

  //texto da pontuação
  stroke(100);
  fill(120);
  text('Score: ' + score, width -100, 40);
}
function gravity() {
  Trex.velocityY += 0.5;
}

function criarNuvens() {
  //frameCount para "atrasar" a criação das sprites de nuvens
  // % (módulo) = resto de uma divisão
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width, 40, 40, 10);
    cloud.addImage(cloudImg);
    cloud.scale = 0.8;
    //round: arredonda para o número mais próximo
    //random: número aleatório
    cloud.y = Math.round(random(10, 100));
    cloud.velocityX = -2;

    //profundidade
    Trex.depth = cloud.depth;
    Trex.depth += 1;

    //tempo de vida
    cloud.lifetime = 345;

    cloudGroup.add(cloud);
  }
}

function criarObstaculos() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width, 160, 10, 40);

    obstacle.scale = 0.7;

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    obstacle.velocityX = -4;
    obstacle.lifetime = 400;

    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudGroup.destroyEach();
  Trex.changeAnimation('running');
  score = 0;
}
