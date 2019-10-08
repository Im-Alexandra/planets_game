// GLOBAL VARIABLES
var stage, queue, preloadText;
var bullets=[];
var hero;
var enemies=[];
var settings = {
  level: 0,
  heroSpeed: 3,
  muted: false,
  paused: false,
  heroLifes: 3,
  enemySpeed: 1,
};
var keys = {
  f: false,
  d: false,
  l: false,
  r: false,
}

function setup(){
  "use strict";
console.log("Setup called");
  stage = new createjs.Stage("myGame");

//PRELOADER TEXT has to be here!
  preloadText = new createjs.Text("", "30px Arial", "#FFF");
  preloadText.textBaseline="middle";
  preloadText.textAlign="center";
  preloadText.x=stage.canvas.width/2;
  preloadText.y=stage.canvas.height/2;
  stage.addChild(preloadText);

//PRELOADER
  queue = new createjs.LoadQueue(true);
  queue.on('progress', progress);
  queue.on('complete', startGame);
  queue.loadManifest([
    {id: "heroImage", src:"sprites/hero.png"},
    {id: "heroJson", src:"sprites/character.json"}
  ]);

}

function progress(e){
  //update preloader/graphics/text
  //call stage.update manually
  //no ticker yet
  console.log("Assets loading");

  var percent = Math.round(e.progress*100);
  preloadText.text = "Loading: " + percent + "%";
  stage.update();
}

function startGame(){
  //add elements, start ticker
  console.log("Assets loaded!");
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', tickHappened);
  stage.removeChild(preloadText);

  //HERO
  var heroSS = new createjs.SpriteSheet(queue.getResult("heroJson"));
  hero = new createjs.Sprite(heroSS, "standDown");
  hero.currentDirection = "down";
  hero.width=hero.height=32;
  hero.x = (stage.canvas.width/2)-(hero.width/2);
  hero.y = stage.canvas.height - hero.width;
  stage.addChild(hero);
  window.addEventListener('keyup', fingerUp);
  window.addEventListener('keydown', fingerDown);

  nextLevel();
}

function fingerUp(e){
  "use strict";
console.log("You pressed" + e.keyCode);

  switch(e.keyCode){
    case 37:
      keys.l=false;
      break;
    case 32:
      keys.f=false;
      break;
    case 39:
      keys.r=false;
      break;
    case 40:
      keys.d=false;
      break;
  }
}

function fingerDown(e){
  "use strict";
  switch(e.keyCode){
    case 37:
      keys.l=true;
      break;
    case 32:
      keys.f =true;
      break;
    case 39:
      keys.r=true;
      break;
    case 40:
      keys.d=true;
      break;
  }
}

function moveHero (){
  if(keys.f){//f is first so if you shoot this animation wins
    hero.gotoAndStop('up');
    if(hero.currentDirection != "up"){
      hero.currentDirection="up";}
  }
  else if (keys.r){
    hero.x+=settings.heroSpeed;
    if(hero.currentDirection != "right"){
      hero.gotoAndPlay('right');
      hero.currentDirection="right";}
      if(hero.x > stage.canvas.width - hero.width){
        hero.x=stage.canvas.width - hero.width;}

  }else if(keys.d){
    hero.gotoAndStop('down');
    if(hero.currentDirection != "down"){
      hero.currentDirection="down";}

  }else if(keys.l){
    hero.x-=settings.heroSpeed;
    if(hero.currentDirection != "left"){
      hero.gotoAndPlay('left');
      hero.currentDirection="left";}
      if(hero.x < 0){
        hero.x=0;}
  }
}

function nextLevel(){
  settings.level++;
  addEnemies();
}

function addEnemies(){
  for(var i = 0; i < settings.level; i++ ){
    //CREATE AND ADD ENEMIES (CRAZY AND NORMAL)!!!
    var temp = new createjs.Shape();
    //var x = Math.floor(Math.random()*750);
    //var y = Math.floor(Math.random()*-200);
    var r=25;
    temp.graphics.beginFill("aqua").drawCircle(204,0,r);
    stage.addChild(temp);
    enemies.push(temp);

    enemies.radius=r;

  }
}

function moveEnemies(){
"use strict";
  console.log("moveEnemies called");

  //has to be backwards
  for(var i=enemies.length-1; i>=0; i--){

    enemies[i].Vdirection='down';
    enemies[i].Hdirection='right';

    if(enemies[i].Hdirection=='right'){
      enemies[i].x+=settings.enemySpeed;
      if(enemies[i].x > 300){
        enemies[i].Hdirection='left';
      }
    }else if(enemies[i].Hdirection=='left'){
      enemies[i].x-=settings.enemySpeed;
    }if(enemies[i].x = 0 - enemies[i].radius){
      enemies[i].Hdirection='right';
    }




}
}


//TICKHAPPENED RUNS 60 TIMES A SECOND, CALL ALL THE FUNCTIONS THAT REQUIRE ANIMATION IN HERE
function tickHappened(e){
  "use strict";
  moveHero();
  moveEnemies();
  stage.update(e);
}

window.addEventListener('load', setup);
