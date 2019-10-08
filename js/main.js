// GLOBAL VARIABLES
var stage, queue, preloadText, canvas, thingsSS, waterPlanet, firePlanet, windPlanet, icePlanet, lock1, lock2, lock3, window1, window2, window3, arrow1, arrow2;
var bullets = [];
var blueFish = [];
var whiteFish = [];
var waterItems = [];
var hero, heroSS;


var settings = {
  level: null,
  heroSpeed: 3,
  muted: false,
  paused: false,
  heroLives: 3,
  planet: null,
  onScreen: null,
  bulletSpeed: 2,
  blueFishCount: 2,
  whiteFishCount: 3,
  blueFishSpeed: 3,
  whiteFishSpeed: 4,
};
var keys = {
  f: false,
  d: false,
  l: false,
  r: false,
}
//VARIABLE OBJECT ORIENTED
var game = {
  stage: null,
  q: null,
  sprites: {
    hero: null,
    fish: null
  }
}

function hitTest(rect1, rect2) {
  if (rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x ||
    rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y) {
    return false;
  }
  return true;
}

function pageLoaded() {
  "use strict";

  createStageWithTick();
  createPreloader();

}

function createStageWithTick() {
  game.stage = new createjs.Stage("canvas");
  game.stage.width = 1600;
  game.stage.height = 900;

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', tick);
  //enable mouseover event with freguency
  game.stage.enableMouseOver(50);
}

function createPreloader() {
  //PRELOADER TEXT
  preloadText = new createjs.Text("", "30px Pecita", "#FFF");
  preloadText.textBaseline = "middle";
  preloadText.textAlign = "center";
  preloadText.x = game.stage.width / 2;
  preloadText.y = game.stage.height / 2;
  game.stage.addChild(preloadText);

  //PRELOADER
  game.q = new createjs.LoadQueue(true);
  game.q.on('progress', preloaderProgress);
  game.q.on('complete', preloaderCompleted);
  game.q.installPlugin(createjs.MotionGuidePlugin);
  //createjs.MotionGuidePlugin.install(); FROM STACKOVERFLOW
  game.q.installPlugin(createjs.Sound);
  game.q.loadManifest([{
      id: "startingScreenBackground",
      src: "img/gameBackground.png"
    },
    {
      id: "thingsSS",
      src: "json/things.json"
    },
    {
      id: "heroImg",
      src: "img/hero.png"
    },
    {
      id: "fishImg",
      src: "img/fish.png"
    }
  ]);
}

function preloaderProgress(e) {
  //update preloader/graphics/text
  //call stage.update manually

  var percent = Math.round(e.progress * 100);
  preloadText.text = "Loading: " + percent + "%";
  game.stage.update();
}

function preloaderCompleted() {
  console.log("Assets loaded!");

  game.stage.removeChild(preloadText);

  //PREPARE SPRITES?
  game.sprites.hero = new createjs.SpriteSheet({
      "framerate": 13,
      "images": [game.q.getResult("heroImg")],
        "frames": {
          "width": 92,
          "height": 92,
          "regX": 0,
          "regY": 0
        },
        "animations": {
          "down": [0, 2],
          "left": [3, 5],
          "right": [6, 8],
          "up": [9, 11],
          "standDown": [1],
          "standLeft": [4],
          "standRight": [7],
          "standUp": [10]
        },
        "_comment": "I found it here: https://grandmadebslittlebits.wordpress.com/"
      });

    game.sprites.fish = new createjs.SpriteSheet({
      "framerate": 9,
      "images": [game.q.getResult("fishImg")],
      "frames": {"width":32, "height":32, "regX":0, "regY":0},
      "animations": {
          "blueLeft": [12,14],
          "blueRight":[24,26],
          "redLeft": [18,20],
          "redRight":[30,33],
          "greenLeft": [15,17],
          "greenRight":[27,29],
          "whiteLeft": [66,68],
          "whiteRight":[78,80]
      },
      "_comment": "I found it here: https://forums.rpgmakerweb.com/index.php?threads/whtdragons-animals-and-running-horses-now-with-more-dragons.53552/"
    })

    thingsSS = new createjs.SpriteSheet(game.q.getResult("thingsSS"));


    startingScreen();
  }

  function startingScreen() {
    "use strict";

    settings.planet = null;
    settings.onScreen = null;
    settings.level = null;

    game.stage.removeAllChildren();
    //change background image
    canvas = document.querySelector("canvas");
    canvas.style.backgroundImage = 'url(img/gameBackground.png)';

    //create planets
    //TODO in a loop with event listener that says which planet was clicked and passes that data to onPlanetScreenStart

    waterPlanet = new createjs.Sprite(thingsSS, "waterPlanet");
    waterPlanet.width = 275;
    waterPlanet.height = 242;
    waterPlanet.x = 327;
    waterPlanet.y = 550;
    waterPlanet.regX = 137.5;
    waterPlanet.regY = 121;
    game.stage.addChild(waterPlanet);
    waterPlanet.addEventListener("click", thingClicked);
    waterPlanet.addEventListener("mouseover", thingHovered);
    waterPlanet.addEventListener("mouseout", thingUnhovered);

    firePlanet = new createjs.Sprite(thingsSS, "firePlanet");
    firePlanet.width = 192;
    firePlanet.height = 153;
    firePlanet.x = 770;
    firePlanet.y = 657;
    firePlanet.regX = 96;
    firePlanet.regY = 76.5;
    game.stage.addChild(firePlanet);
    firePlanet.addEventListener("click", thingClicked);
    firePlanet.addEventListener("mouseover", thingHovered);
    firePlanet.addEventListener("mouseout", thingUnhovered);

    windPlanet = new createjs.Sprite(thingsSS, "windPlanet");
    windPlanet.width = 278;
    firePlanet.height = 256;
    windPlanet.x = 1260;
    windPlanet.y = 253;
    windPlanet.regX = 139;
    windPlanet.regY = 128;
    game.stage.addChild(windPlanet);
    windPlanet.addEventListener("click", thingClicked);
    windPlanet.addEventListener("mouseover", thingHovered);
    windPlanet.addEventListener("mouseout", thingUnhovered);

    icePlanet = new createjs.Sprite(thingsSS, "icePlanet");
    icePlanet.width = 151;
    icePlanet.height = 136;
    icePlanet.x = 1380;
    icePlanet.y = 720;
    icePlanet.regX = 75.5;
    icePlanet.regY = 68;
    game.stage.addChild(icePlanet);
    icePlanet.addEventListener("click", thingClicked);
    icePlanet.addEventListener("mouseover", thingHovered);
    icePlanet.addEventListener("mouseout", thingUnhovered);

    //create LOCKS
    lock1 = new createjs.Sprite(thingsSS, "lock");
    lock1.width = 100;
    lock1.height = 136;
    lock1.x = 645;
    lock1.y = 540;
    lock1.scaleX = 0.4;
    lock1.scaleY = 0.4;
    lock1.rotation = -28;
    game.stage.addChild(lock1);

    lock2 = new createjs.Sprite(thingsSS, "lock");
    lock2.width = 100;
    lock2.height = 136;
    lock2.x = 1060;
    lock2.y = 125;
    lock2.scaleX = 0.4;
    lock2.scaleY = 0.4;
    lock2.rotation = -45;
    game.stage.addChild(lock2);

    lock3 = new createjs.Sprite(thingsSS, "lock");
    lock3.width = 100;
    lock3.height = 136;
    lock3.x = 1310;
    lock3.y = 560;
    lock3.scaleX = 0.4;
    lock3.scaleY = 0.4;
    lock3.rotation = 10;
    game.stage.addChild(lock3);

  }

  //--------------------------------PLANET EVENTS-----------------------------
  function thingHovered(e) {
    var thingHovered = e.target;
    //console.log("you are hovering " + planetHovered.currentAnimation);
    document.body.style.cursor = 'pointer';
    if (thingHovered.currentAnimation == "waterPlanet") {
      waterPlanet.scaleX = 1.05;
      waterPlanet.scaleY = 1.05;
    } else if (thingHovered.currentAnimation == "firePlanet") {
      firePlanet.scaleX = 1.05;
      firePlanet.scaleY = 1.05;
    } else if (thingHovered.currentAnimation == "icePlanet") {
      icePlanet.scaleX = 1.05;
      icePlanet.scaleY = 1.05;
    } else if (thingHovered.currentAnimation == "windPlanet") {
      windPlanet.scaleX = 1.05;
      windPlanet.scaleY = 1.05;
    } else if (thingHovered.currentAnimation == "level01") {
      window1.scaleX = 1.05;
      window1.scaleY = 1.05;
    } else if (thingHovered.currentAnimation == "level02") {
      window2.scaleX = 1.05;
      window2.scaleY = 1.05;
    } else if (thingHovered.currentAnimation == "arrow") {
      arrow1.scaleX = 1.05;
      arrow1.scaleY = 1.05;
    }
  }


  function thingUnhovered(e) {
    var thingUnhovered = e.target;
    document.body.style.cursor = 'default';
    if (thingUnhovered.currentAnimation == "waterPlanet") {
      waterPlanet.scaleX = 1;
      waterPlanet.scaleY = 1;
    } else if (thingUnhovered.currentAnimation == "firePlanet") {
      firePlanet.scaleX = 1;
      firePlanet.scaleY = 1;
    } else if (thingUnhovered.currentAnimation == "icePlanet") {
      icePlanet.scaleX = 1;
      icePlanet.scaleY = 1;
    } else if (thingUnhovered.currentAnimation == "windPlanet") {
      windPlanet.scaleX = 1;
      windPlanet.scaleY = 1;
    } else if (thingUnhovered.currentAnimation == "level01") {
      window1.scaleX = 1;
      window1.scaleY = 1;
    } else if (thingUnhovered.currentAnimation == "level02") {
      window2.scaleX = 1;
      window2.scaleY = 1;
    } else if (thingUnhovered.currentAnimation == "arrow") {
      arrow1.scaleX = 1;
      arrow1.scaleY = 1;
    }
  }

  // TODO ALREADY HATE THIS LOOOONG FUNCTION - OPTIMIZE?
  function thingClicked(e) {
    var thingClicked = e.target;
    console.log(thingClicked.currentAnimation);
    if (thingClicked.currentAnimation == "waterPlanet") {
      //rocketToWaterPlanet(); then on animation end follow with the rest
      settings.planet = "water";
      settings.onScreen = "pickLevel";

      pickLevelScreen();

    } else if (thingClicked.currentAnimation == "firePlanet") {
      settings.planet = "fire";
      settings.onScreen = "pickLevel";

      pickLevelScreen();

    } else if (thingClicked.currentAnimation == "icePlanet") {
      settings.planet = "ice";

    } else if (thingClicked.currentAnimation == "windPlanet") {
      settings.planet = "wind";

    } else if (thingClicked.currentAnimation == "level01" && settings.planet == "water") {
      settings.onScreen = "play";
      settings.level = 1;

      game.stage.removeAllChildren();
      canvas.style.backgroundImage = 'url(img/waterPlanetPlay.png)';
      playScreen();

    } else if (thingClicked.currentAnimation == "level01" && settings.planet == "fire") {
      settings.level = 1;


    } else if (thingClicked.currentAnimation == "level02" && settings.planet == "water") {
      settings.onScreen = "play";
      settings.level = 2;

      game.stage.removeAllChildren();
      canvas.style.backgroundImage = 'url(img/waterPlanetPlay.png)';
      playScreen();

    } else if (thingClicked.currentAnimation == "level02" && settings.planet == "fire") {

    } else if (thingClicked.currentAnimation == "arrow" && settings.onScreen == "pickLevel") {
      startingScreen();

    } else if (thingClicked.currentAnimation == "arrow" && settings.onScreen == "playScreen") {
      pickLevelScreen();
    }

  }

  function pickLevelScreen() {
    if (settings.planet == "water") {
      settings.onScreen = "pickLevel";
      settings.level = null;

      game.stage.removeAllChildren();
      canvas.style.backgroundImage = 'url(img/waterPlanetStart.png)';

      addWindows();
      addArrow();
    } else if (settings.planet == "fire") {
      settings.onScreen = "pickLevel";

      game.stage.removeAllChildren();
      canvas.style.backgroundImage = 'url(img/firePlanetStart.png)';

      addWindows();
      addArrow();
    } else if (settings.planet == "wind") {
      settings.onScreen = "pickLevel";

      game.stage.removeAllChildren();
      canvas.style.backgroundImage = 'url(img/windPlanetStart.png)';

      addWindows();
      addArrow();
    } else if (settings.planet == "ice") {
      settings.onScreen = "pickLevel";

      game.stage.removeAllChildren();
      canvas.style.backgroundImage = 'url(img/icePlanetStart.png)';

      addWindows();
      addArrow();
    }
  }

  function playScreen() {
    if (settings.planet == "water") {
      settings.onScreen = "playScreen";
      //add hero, arrow, platform, level sign, lives, water count, enemies
      addArrow();
      addHero();
      addPlatform();
      addBlueFish();
      //addWhiteFish();
    /*  addLevelText();
      addCount();
      addLives();
      }*/

      //add enemies
    } else if (settings.planet == "fire") {
      settings.onScreen = "playScreen";

      addArrow();
      addHero();
      addPlatform();
    } else if (settings.planet == "wind") {

    } else if (settings.planet == "ice") {

    }
  }


  //TODO ASK make this work omg would be A W E S O M E
  function rocketToWaterPlanet() {
    var path = new createjs.Shape();
    path.graphics.beginStroke("#ff00ff").moveTo(0, 500).arcTo(700, 30, 530, 900, 250).curveTo(500, 730, 590, 800).lineTo(410, 630);
    game.stage.addChild(path);

    var rocket = new createjs.Shape();
    rocket.graphics.beginFill("#ff00ff").drawCircle(0, 0, 50);
    game.stage.addChild(rocket);

    createjs.Tween.get(rocket).to({
      guide: {
        path: [0, 500, 700, 30, 530, 900, 250, 500, 730, 590, 800, 410, 630]
      }
    }, 7000);
  }


  //------------------------------WINDOW EVENTS--------------------------------
  function addWindows() {
    window1 = new createjs.Sprite(thingsSS, "level01");
    window1.width = 180;
    window1.height = 180;
    window1.x = game.stage.width / 2 - window1.width / 2 - 20;
    window1.y = game.stage.height / 2;
    window1.regX = 90;
    window1.regY = 90;
    game.stage.addChild(window1);
    window1.addEventListener("click", thingClicked);
    window1.addEventListener("mouseover", thingHovered);
    window1.addEventListener("mouseout", thingUnhovered);

    window2 = new createjs.Sprite(thingsSS, "level02");
    window2.width = 180;
    window2.height = 180;
    window2.x = game.stage.width / 2 + window2.width / 2 + 20;
    window2.y = game.stage.height / 2;
    window2.regX = 90;
    window2.regY = 90;
    game.stage.addChild(window2);
    window2.addEventListener("click", thingClicked);
    window2.addEventListener("mouseover", thingHovered);
    window2.addEventListener("mouseout", thingUnhovered);
  }

  //------------------------ARROWS--------------------------
  function addArrow() {
    arrow1 = new createjs.Sprite(thingsSS, "arrow");
    arrow1.width = 120;
    arrow1.height = 40;
    arrow1.x = 100;
    arrow1.y = 50;
    arrow1.regX = 60;
    arrow1.regY = 20;
    game.stage.addChild(arrow1);
    arrow1.addEventListener("click", thingClicked);
    arrow1.addEventListener("mouseover", thingHovered);
    arrow1.addEventListener("mouseout", thingUnhovered);

  }

  //--------------------------HERO--------------------------
  class Hero extends createjs.Sprite {
    constructor(spritename) {
      super(game.sprites.hero, spritename);

      this.width = 92;
      this.height = 92;
      this.speed = 4;
      this.lives = 3;
      this.x = (game.stage.width/2) - (this.width/2);
      this.y = (game.stage.height - this.height - 25);
    }
  }

  function addHero() {
    hero = new Hero("standDown");
    game.stage.addChild(hero);
    hero.isMoving=false;
    hero.currentDirection="down";
    window.addEventListener('keyup', fingerUp);
    window.addEventListener('keydown', fingerDown);
  }

  /*class Fish extends createjs.Sprite {
    constructor(spritename){
      super(game.sprites.fish, spritename);
      this.width=this.height=32;
      this.type = spritename;

    }
  }

  class BlueFish extends Fish {
    constructor(){
      super("blueRight");
      var thisBlueFish = this;
      this.speed = 4;
      this.scaleY = 1.7;
      this.scaleX = 1.7;
    }
  }

  class WhiteFish extends Fish {
    constructor(){
      super("whiteLeft");
      this.speed = 6;
      this.scaleY = 2.5;
      this.scaleX = 2.5;
    }
  }*/

  function addBlueFish(){
    if (settings.level==1 && settings.planet=="water"){
      settings.blueFishCount++;
      for (var i=0; i < settings.blueFishCount; i++){
        var temp = new createjs.Sprite(game.sprites.fish, "blueRight");
        temp.width= 32;
        temp.height= 32;
        temp.scaleX= 1.7;
        temp.scaleY= 1.7;
        //between -30 and -300?
        temp.x = Math.floor(Math.random() * -471) + 30;
        //between 80 and 710
        temp.y = Math.floor(Math.random() * 631) + 80;

        game.stage.addChild(temp);
        blueFish.push(temp);
      }

    }

    if (settings.level==2 && settings.plante=="water"){

    }
  }

  /*function addWhiteFish(){
    settings.whiteFishCount = 5;
    settings.whiteFishCount++;
    if (settings.level==1){
      for (var i=0; i<whiteFishCount; i++){
        var temp = new WhiteFish("whiteLeft");
        game.stage.addChild(temp);
      }


    }

    if (settings.level==2){

    }

  }*/

  function addPlatform(){
    if (settings.planet=="water"){
      var platform = new createjs.Shape();
      platform.graphics.beginFill("#FFF").drawRect(0,875,1600,25);
      game.stage.addChild(platform);
    } else if (settings.planet=="fire"){
      var platform = new createjs.Shape();
      platform.graphics.beginFill("#000").drawRect(0,875,1600,25);
      game.stage.addChild(platform);
    }
  }

/*  class Fish extends createjs.Sprite {
    constructor(spritename){
      super(game.sprites.fish, spritename);
      this.type = spritename;
      this.width = this.height = 32;
    }
  }*/


  //-----------------------OLD CODE-------------------------

  function fingerUp(e) {
    "use strict";
    //console.log("You pressed" + e.keyCode);
    switch (e.keyCode) {
      case 37:
        keys.l = false;
        break;
      case 32:
        fire();
        keys.f = false;
        break;
      case 39:
        keys.r = false;
        break;
      case 40:
        keys.d = false;
        break;
    } if(!keys.l && !keys.r && !keys.u && !keys.d){
        hero.isMoving=false;
        hero.gotoAndStop(hero.currentDirection);
    } //from Maite (Jonas)
  }

  function fingerDown(e) {
    "use strict";
    switch (e.keyCode) {
      case 37:
        keys.l = true;
        break;
      case 32:
        keys.f = true;
        break;
      case 39:
        keys.r = true;
        break;
      case 40:
        keys.d = true;
        break;
    }//from Maite (Jonas)
  }

  function fire() {

  var temp = new createjs.Shape();
  temp.graphics.beginFill('#FFF').drawCircle(0, 0, 4);
  temp.x = hero.x + hero.width / 2;
  temp.y = hero.y;
  //bullets have to have width and height for hit detection
  temp.width = 4;
  temp.height = 4;
  game.stage.addChild(temp);
  bullets.push(temp);
}

function moveBullets() {
  for (var i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= settings.bulletSpeed;

    //REMOVING BULLETS
    if (bullets[i].y < -10) {
      game.stage.removeChild(bullets[i]);
      bullets.splice(i, 1);
    }
  }
}


// whole hero moving logic is from Maite (Jonas) - I just slightly changed it :)
//TODO fix up and down
  function moveHero() {
    if (keys.f) { //f is first so if you shoot this animation wins
      hero.gotoAndPlay('standUp');
      if (hero.currentDirection != "up") {
          hero.currentDirection = "up";
      }
    } else if (keys.r) {
      hero.x += hero.speed;
      if (hero.currentDirection != "right" || !hero.isMoving){
          hero.isMoving=true;
          hero.gotoAndPlay('right');
          hero.currentDirection = "right";
      }
      if (hero.x > game.stage.width - hero.width) {
          hero.x = game.stage.width - hero.width;
      }

    } else if (keys.d) {
      hero.gotoAndStop('down');
      if (hero.currentDirection != "down") {
          hero.currentDirection = "down";
      }

    }
   if (keys.l) {
      hero.x -= hero.speed;
      if (hero.currentDirection != "left" || !hero.isMoving){
          hero.isMoving=true;
          hero.gotoAndPlay('left');
          hero.currentDirection = "left";
      }
      if (hero.x < 0) {
          hero.x = 0;
      }
    }
  }

  function moveBlueFish() {
    "use strict";
  //console.log("moveBlueFish called");

  //has to be backwards
  for (var i = blueFish.length - 1; i >= 0; i--) {
    blueFish[i].x += settings.blueFishSpeed;
    if (blueFish[i].x > game.stage.width + 200) {
      blueFish[i].y = Math.floor(Math.random() * 631) + 80;
      blueFish[i].x = Math.floor(Math.random() * -471) + 30;


    }
  }
  }

  function doCollisionChecking() {
  //enemies vs hero
  /*for (var i = enemies.length - 1; i >= 0; i--) {
    if (hitTest(hero, enemies[i])) {
      settings.heroLives--;
      var lifeLostMusic = new createjs.Sound.play("lifeLost");
      stage.removeChild(enemies[i]);
      enemies.splice(i, 1);
      if (settings.heroLives <= 0) {
        //console.log("DEAD");
        gamePlaying = false;
        var gameOverMusic = new createjs.Sound.play("gameOver");
        backMusic.paused = true;

        //GAME OVER SCREEN TEXT
        thingsSS = new createjs.SpriteSheet(queue.getResult("thingsSS"));
        var gameOverText = new createjs.Sprite(thingsSS, "gameOver");
        gameOverText.width = 300;
        gameOverText.height = 147;
        gameOverText.x = stage.canvas.width / 2 - gameOverText.width / 2;
        gameOverText.y = stage.canvas.height / 2 - gameOverText.height / 2;
        stage.removeAllChildren();
        stage.addChild(gameOverText);

        //GAME OVER DOGE APPEARS
        var dogeImpressed = new createjs.Sprite(thingsSS, "dogeImpressed");
        dogeImpressed.width = 50;
        dogeImpressed.height = 50;
        dogeImpressed.x = stage.canvas.width - dogeImpressed.width;
        dogeImpressed.y = stage.canvas.height - dogeImpressed.height;
        stage.addChild(dogeImpressed);
        for (var i = 0; i<enemies.length; i++){
          stage.removeChild(enemies[i]);
        }

        //REMOVE ENEMIES HERE - HOW? WHY CANT I REMOVE ENEMIES???


      }
    }
  }*/

  //bullets vs enemies
  for (var bf = blueFish.length - 1; bf >= 0; bf--) {
    for (var b = bullets.length - 1; b >= 0; b--) {
      //console.log("Comparing", e, b)
      if (hitTest(blueFish[bf], bullets[b])) {
        game.stage.removeChild(blueFish[bf]);
        game.stage.removeChild(bullets[b]);

        var rand = Math.random()*500;
        if (rand < 10){
          waterItem = new createjs.Sprite(thingsSS, "waterBonus");
          waterItem.width = 50;
          waterItem.height = 74;
          waterItem.x = blueFish[bf].x;
          waterItem.y = blueFish[bf].y;
          waterItem.scaleX = 0.6;
          waterItem.scaleY = 0.6;
          game.stage.addChild(waterItem);
          waterItems.push(waterItem);

          blueFish.splice(bf, 1);
          bullets.splice(b, 1);
        }


      }
    }
  }

  //TODO some blueFish are not visible :O
  if (blueFish.length <=2) {
    addBlueFish();
  }


/*moveWaterItems(){

}*/


}



  //TICKHAPPENED RUNS 60 TIMES A SECOND, CALL ALL THE FUNCTIONS THAT REQUIRE ANIMATION IN HERE
  function tick(e) {
    "use strict";
    /*
    moveEnemies();*/
    moveHero();
    moveBullets();
    moveBlueFish();
    doCollisionChecking();
  //  moveWaterItems();
    game.stage.update(e);
  }

  window.addEventListener('load', pageLoaded);
