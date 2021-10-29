let bird;
let pipes = [];
let score;
let highscore;
let mic;
let vol;
let sliderTop;
let sliderBottom;
let clap;
function setup(){
  //canvas setup
  let canvas = createCanvas(500,500);
  canvas.parent('canvasDiv');
  clap = false;

  //score setup
  score = 0;
  highscore = score;

  //game objects
  bird = new Bird();
  pipes.push(new Pipe());

  //audio setup
  getAudioContext().suspend();
  mic = new p5.AudioIn();
  mic.start();

  //slider setup
  sliderTop = createSlider(0,1,0.15,0.01);
  sliderTop.id('sliderTop');
  sliderTop.parent('sliderTopDes');
  sliderBottom = createSlider(0,1,0.1,0.01);
  sliderBottom.id('sliderBottom');
  sliderBottom.parent('sliderBottomDes');

}
  function draw(){
    noStroke();
    background(20);
    vol = mic.getLevel();
    //score
    fill(255);
    textSize(36);
    textAlign(CENTER, TOP);
    text(score,width/2,0);
    textSize(36);
    fill(255,100);
    text(highscore,width/2,32);
    if(score>highscore){
      highscore = score;
    }

    //bird updates
    bird.show();
    bird.update();

    //pipe updates
    if(frameCount % 100 == 0){
      pipes.push(new Pipe());
    }
    for(let i = pipes.length; i>=0; i--){
      if(pipes[i]){
        pipes[i].show();
        pipes[i].update();
        if(pipes[i].hits(bird)){
          pipes[i].flag = true;
          score = 0;
      }
        if(pipes[i].offscreen()){
          if(!pipes[i].flag){
            score++;
          }
          pipes.splice(i,1);
    }  }  }

//sound work and values

  fill (0,255,0);
  let y = map(vol,0,1,height,0);
  rect(width-40, y, 40, height-y);

  let thresholdTop = sliderTop.value();
  let thresholdBottom = sliderBottom.value();
  let ty = map(thresholdTop,0,1,height,0);
  let by = map(thresholdBottom,0,1,height,0);

//line work
  stroke('#f8002f');
  strokeWeight(4);
  line(width-40,ty,width,ty);
  stroke('#6e93d6');
  line(width-40,by,width,by);

  if(vol>thresholdTop && !clap){
    bird.up();
    clap = true;
  }
  if(vol<thresholdBottom){
    clap = false;
}
}


  function keyPressed(){
    if (key == ' ' || keyCode === UP_ARROW){
    bird.up();
  }
}

function mousePressed(){
   userStartAudio();
}



//-------------------------
function Bird(){
  this.y = height/2;
  this.x = 60;
  this.size = 25;

  this.gravity = 0.55;
  this.velocity = 0;
  this.lift = -20;
  this.show = function(){
    fill(255);
    ellipse(this.x,this.y,this.size,this.size);
  }

  this.up = function(){
  this.velocity += this.lift;
}
  this.upSound = function(){
  this.velocity += this.lift * 0.5;
}
  this.update = function(){
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if(this.y>height){
        this.y = height;
        this.velocity = 0;
    }

    if(this.y<0){
        this.y = 0;

    }
  }
}


//------------------
function Pipe(){
  this.emptyspace = height/4;
  this.top = random(height * (3.0/4.0));
  this.bottom = width - this.top - this.emptyspace;
  this.x = width;
  this.w = 30;
  this. speed = 3;
  this.highlight = false;
  this.flag = false;
  this.show = function (){
  fill(255);
  if(this.highlight){
    fill(255,0,0);
    this.highlight = false;
  }
  rect(this.x,0,this.w,this.top);
  rect(this.x,height-this.bottom,this.w,this.bottom);
  }
  this.update = function(){
  this.x -= this.speed;
  }

  this.offscreen = function(){
    return (this.x < -this.w);
}
  this.hits = function(bird){
    if(bird.y<this.top || bird.y >height-this.bottom){
      if(bird.x >this.x && bird.x < this.x+this.w){
          this.highlight = true;

          return true;
      }
    }
  return false;
  }

}
