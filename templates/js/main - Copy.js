setTimeout(function(){

const canvas = document.getElementById('one'); //Where the game is being displayed
const context = canvas.getContext('2d');
const grid = 64;
const numRows = 13;
const numCols = 15;
//var imgb = document.getElementById('background');
//const softWallCanvas = document.createElement('canvas');

// canvas for unbreakable bricks
const wallCanvas = document.createElement('canvas');
const wall = wallCanvas.getContext('2d');
var img1 = document.getElementById('hardWall');
wallCanvas.width = wallCanvas.height = grid;
wall.drawImage(img1, 0, 0);

// canvas for breakable bricks
const swallCanvas = document.createElement('canvas');
const swall = swallCanvas.getContext('2d');
var img2 = document.getElementById('softWall');
swallCanvas.width = swallCanvas.height = grid;
swall.drawImage(img2, 0, 0); 

// canvas for power-up
const powerUpCanvas = document.createElement('canvas');
const powerUp = powerUpCanvas.getContext('2d');
var img3 = document.getElementById('powerUp');
powerUpCanvas.width = powerUpCanvas.height = grid;
powerUp.drawImage(img3, 0, 0); 


const types = {
  wall: '▉',
  swall: 's',
  powerUP: 'y',
  placeholder: 'x',
};

let entities = [];

let cells = [];
const template = [
  ['▉','▉','▉','▉','▉', '▉','▉','▉','▉','▉','▉','▉', '▉','▉','▉'],
  ['▉',    ,    ,    ,    ,    ,    ,    ,    ,   ,    ,'x' ,'x' ,'x' ,'▉'],
  ['▉',    ,'▉',    ,'▉',    ,'▉',    ,'▉' ,   ,'▉',    ,'▉','x' ,'▉'],
  ['▉',    ,    ,    ,    ,    ,    ,    ,    ,   ,    ,    ,    ,'x' ,'▉'],
  ['▉',    ,'▉',    ,'▉',    ,'▉',    ,'▉' ,   ,'▉',    ,'▉',    ,'▉'],
  ['▉',    ,    ,    ,    ,    ,    ,    ,    ,   ,    ,    ,    ,    ,'▉'],
  ['▉',    ,'▉',    ,'▉',    ,'▉',    ,'▉' ,   ,'▉',    ,'▉',    ,'▉'],
  ['▉',    ,    ,    ,    ,    ,    ,    ,    ,   ,    ,    ,    ,    ,'▉'],
  ['▉',    ,'▉',    ,'▉',    ,'▉',    ,'▉' ,   ,'▉',    ,'▉',    ,'▉'],
  ['▉','x' ,    ,    ,    ,    ,    ,    ,    ,   ,    ,    ,    ,    ,'▉'],
  ['▉','x' ,'▉',    ,'▉',    ,'▉',    ,'▉' ,   ,'▉',    ,'▉',    ,'▉'],
  ['▉','x' ,'x' ,'x' ,    ,    ,    ,    ,    ,   ,    ,    ,    ,    ,'▉'],
  ['▉','▉','▉','▉','▉', '▉','▉','▉','▉','▉','▉','▉', '▉','▉','▉'],
];

const template2 = [
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
  [    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
];

// populate the level with walls
function generateLevel() {
  template.cells = [];

  for (let row = 0; row < numRows; row++) {
    template.cells[row] = [];

    for (let col = 0; col < numCols; col++) {

      // 80% chance cells turn soft wall
      if (template[row][col] !== types.wall && template[row][col] !== types.placeholder && template[row][col] !== types.powerUP && Math.random() < 0.8) {
        template.cells[row][col] = types.swall;
        // template2.cells[row][col] = types.powerUP;
      }
      // All Walls on template to Walls. 
      else if (template[row][col] === types.wall) {
        template.cells[row][col] = types.wall;
      }
      // All PowerUps on template to PowerUps. 
      else if (template[row][col] === types.powerUP) {
        template.cells[row][col] = types.powerUP;
      }
    }
  }
}

// background Engine for PowerUp and other stuff
function generateLevelback() {
  template2.cells = [];

  for (let row = 0; row < numRows; row++) {
    template2.cells[row] = [];

    for (let col = 0; col < numCols; col++) {

      // 20% chance cells turn out Upgrade
      if (template[row][col] === types.swall) {
        template2.cells[row][col] = types.powerUP;
      }
    }
  }
}

// player character (just a simple circle)
const player = {
  row: 11,
  col: 1,
  radius: grid * 0.5,
  render() {
    const x = (this.col + 0.5) * 64;
    const y = (this.row + 0.5) * 64;

    context.save();
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }
}

// Bomb placing (just simple circle)
const bomb = {

}


// game loop
let last;
let dt;
function loop(timestamp) {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // calculate the time difference since the last update. requestAnimationFrame
  // passes the current timestamp as a parameter to the loop
  if (!last) {
    last = timestamp;
  }
  dt = timestamp - last;
  last = timestamp;

  // update and render everything in template 
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      switch(template.cells[row][col]) {
        case types.wall:
          context.drawImage(wallCanvas, col * grid, row * grid);
          break;
        case types.swall:
          context.drawImage(swallCanvas, col * grid, row * grid);
          break;
        case types.powerUP:
          context.drawImage(powerUpCanvas, col * grid, row * grid);
          break;
      }
    }
  }

  // update and render everything in template2
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      switch(template2.cells[row][col]) {
        case types.powerUP:
          context.drawImage(powerUpCanvas, col * grid, row * grid);
        case types.wall:
          context.drawImage(wallCanvas, col * grid, row * grid);
          break;
      }
    }
  }

  
  // update and render all entities
  entities.forEach((entity) => {
    entity.update(dt);
    entity.render();
  });
  // remove dead entities
  entities = entities.filter((entity) => entity.alive);

  player.render();
}



// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
  let row = player.row;
  let col = player.col;

  // left arrow key
  if (e.which === 37) {
    col--;
  }
  // up arrow key
  else if (e.which === 38) {
    row--;
  }
  // right arrow key
  else if (e.which === 39) {
    col++;
  }
  // down arrow key
  else if (e.which === 40) {
    row++;
  }
  // placing bomb
  else if (e.which === 32){
    bombe ();
  }
  // don't move the player if something is already at that position
  if (template.cells[row][col] !== types.wall && template.cells[row][col] !== types.swall) {
    player.row = row;
    player.col = col;
  }
});



// start the game
generateLevel(); //Where the blocks spawn
generateLevelback() //background arbeit
requestAnimationFrame(loop); //
}, 10);