
const canvas = document.querySelector('canvas');
canvas.width = 1000;
canvas.height = 800;
canvas.style.border = '1px solid red';
const ctx = canvas.getContext('2d');

const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

const GRAVITY = 2;
// const FRICTION = 0.2;

class Rectangle {

  constructor({ x, y, w, h, color, velocity }){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.velocity = velocity;
    this.playerChoiceArray = [];
  }

  pickRandomColor(){
    const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'teal'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  jump(){
    this.velocity.y = -30;
  }

  addPlayerChoice(choice){
    choice.y = canvas.height - (choice.h * (this.playerChoiceArray.length + 1))
    this.playerChoiceArray.push(choice);
  }

  updatePosition(){
    this.velocity.y += GRAVITY;
    // this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  checkCollision(obs){
    
    if(obs){
      if (
        this.x < obs.x + obs.w &&
        this.x + this.w > obs.x &&
        this.y < obs.y + obs.h &&
        this.h + this.y > obs.y
      ) {
        // Collision detected!
        if(this.velocity.y > 0){
          this.velocity.y = 0;
          this.y = obs.y - this.h;
        }
        if(this.velocity.y < 0){
          this.velocity.y = 0;
          this.y = obs.y + obs.h;
        }
        return true;
      }
    }
    return false;
  }

  checkColorMatch(obs){
    return this.color === obs.color;
  }

  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }

}

const floor = new Rectangle({
  x: 0,
  y: canvas.height,
  w: canvas.width,
  h: 100,
  color: 'black',
  velocity: {
    x: 0,
    y: 0
  }
});

const player = new Rectangle({
  x: 375,
  y: 650,
  w: 50,
  h: 50,
  color: 'black',
  velocity: {
    x: 0,
    y: 0
  }
});
player.pickRandomColor();

window.addEventListener('keydown', e => {
  // e.preventDefault();
  switch(e.code){
    case 'Space':
      player.jump();
      break;
  }
});

const matchArray = (() => {
  const arr = [];
  for(let i = 0; i < 5; i++){
    arr.push(new Rectangle({
      x: 375,
      y: 550 - (i * 50),
      w: 50,
      h: 50,
      color: 'black',
      velocity: {
        x: 0,
        y: 0
      }  
    }));
  }
  
  return arr;
})();

let frameCount = 0;

const animateLoop = () => {

  clearCanvas();

  for(let i = 0; i < matchArray.length; i++){
    if(player.checkCollision(matchArray[i]) && player.checkColorMatch(matchArray[i])){
      const match = matchArray.splice(i, 1)[0];
      player.addPlayerChoice(match);
      i--;
      player.pickRandomColor();
      console.log(player.playerChoiceArray);
    } else {
      if(frameCount % 45 === 0){
        matchArray[i].pickRandomColor();
      }
      matchArray[i].draw();
    }
  }

  player.updatePosition();
  player.checkCollision(floor);
  
  for(let i = 0; i < player.playerChoiceArray.length; i++){
    player.checkCollision(player.playerChoiceArray[i])
    player.playerChoiceArray[i].draw()
  }

  player.draw();

  frameCount++;
}

setInterval(animateLoop, 16)