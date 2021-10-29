//To Do list:
//1. Add transition function for colour changes. DONE
//2. Add different colours to particles. DONE
//3. Gradient colour for background if possible.
//4. Customize size. DONE
//5. Customize speed.
//6. Add mouse chase mode. DONE
//7. Particle number.
//8. Particle trails. DONE
//9. Feature for changing colour continuously.

let canvas;
let particles = [];
let number = 255;
//background controllers
let backColour = 0;
let b = 0;
//trails
let opacity;
//chaseMode
let chaseMode = false;
let displayText = true;
let particleTrails = false;
function setup(){
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');
  for(let i=0;i<number;i++){
    particles[i] = new Particle(i);
  }
  opacity = 255;
}
function draw(){
  background(backColour);

  for(let i=0;i<number;i++){
    particles[i].show();
    particles[i].move();
    particles[i].collideWalls();
    if(chaseMode){
      particles[i].chase();
    }
  }
  if(displayText){
    fill(255, 150);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Press M to change the colour of particles", width/2 , height/2 - (26*3));
    text("Press B to change the colour of the background", width/2 , height/2 - (26*2));
    text("Press S to change the size of the particles", width/2 , height/2 - (26*1));
    text("Press T to toggle particle trails", width/2, height/2);
    text("Press C to toggle chase mode", width/2 , height/2 + (26*1));
    text("Press O to toggle options on and off", width/2 , height/2 + (26*2));
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

//Keypressed function
function keyPressed(){
  if(key === "m"){
    for(let i=0;i<255;i++){
      //particles should transition smoothly between two colour values ideally
      //how to accomplish that?
      //i have no clue...yet!
      particles[i].changeColour();
    }
  }
  if(key === "b"){
    changeBackgroundColour();
  }
  if(key === "s"){
    let inc = false;
    for(let i=0;i<number;i++){
      if(!inc){
        particles[i].size -= 8;
        if(particles[i].size < 4) {inc = true;}
      }else if(inc){
        particles[i].size += 8;
        if(particles[i].size > 38) {inc = false;}
      }
    }
  }

  if(key === "t"){
    if(particleTrails == false){
      opacity = 12;
      b-=1;
      changeBackgroundColour();
      particleTrails = true;
    }
    else if(particleTrails == true){
      opacity = 255;
      b-=1;
      changeBackgroundColour();
      particleTrails = false;
    }
  }

  if(key === "c"){
    if(chaseMode == false){chaseMode =  true;}
    else if(chaseMode == true){chaseMode = false;}
  }
  if(key === "r"){
    colourChangeMode = true;
  }
  if(key === "o"){
    if(displayText == false){displayText = true;}
    else if (displayText == true){displayText = false;}
  }
}

function changeBackgroundColour(){
  b += 1;
  switch(b){
    case 0:
      backColour = color(0, 0, 0,opacity);
      b =0;
    case 1:
      backColour = color(148, 0, 211,opacity);
      b = 1;
      break;
    case 2:
      backColour = color(75, 0, 130,opacity);
      b = 2;
      break;
    case 3:
      backColour = color(0, 0, 255,opacity);
      b = 3;
      break;
    case 4:
      backColour = color(0, 255, 0,opacity);
      b = 4;
      break;
    case 5:
      backColour = color(255, 255, 0,opacity);
      b = 5;
      break;
    case 6:
      backColour = color(255, 127, 0,opacity);
      b = 6;
      break;
    case 7:
      backColour = color(255, 0, 0,opacity);
      b = 7;
      break;
    default:
      backColour = color(0, 0, 0,opacity);
      b = 0;
  }
}

//Particle code
function Particle(index){
  this.x = random(0,width);
  this.y = random(0,height);
  this.index = index;
  this.colour = color(148, 0, 211,this.index);
  this.c = 1;
  this.size = 32;
  this.direction = p5.Vector.random2D();
  this.velocity = random() * 10;
  this.show = function(colourArray){
    noStroke();
    if(colourArray){
      fill(color(colourArray[0],colourArray[1],colourArray[2]));
    }else{
      fill(this.colour);
    }
    ellipse(this.x,this.y,this.size,this.size);
  }

  this.move = function(){
    this.x += this.direction.x;
    this.y += this.direction.y;
  }

  this.collideWalls = function(){
    if(this.x >= width || this.x <= 0){
      this.direction.x *= -1;
    }
    if(this.y >= height || this.y <= 0){
      this.direction.y *= -1;
    }
  }

  this.changeColour = function(){
    this.c += 1;
    switch(this.c){
      case 1:
        this.colour = color(148, 0, 211,this.index);
        this.c = 1;
        break;
      case 2:
        this.colour = color(75, 0, 130,this.index);
        this.c = 2;
        break;
      case 3:
        this.colour = color(0, 0, 255,this.index);
        this.c = 3;
        break;
      case 4:
        this.colour = color(0,255,0,this.index);
        this.c = 4;
        break;
      case 5:
        this.colour = color(255, 255, 0,this.index);
        this.c = 5;
        break;
      case 6:
        this.colour = color(255, 127, 0,this.index);
        this.c = 6;
        break;
      case 7:
        this.colour = color(255, 0, 0,this.index);
        this.c = 7;
        break;
      default:
      this.colour = color(148, 0, 211,this.index);
      this.c = 1;
    }
  }

  this.chase = function(){
    let velVec = createVector(mouseX - this.x, mouseY - this.y);
    let accVec = velVec.normalize().mult(0.5);
    this.direction.add(accVec);
    accVec.mult(0);
    this.direction.limit(10);
  }

}
