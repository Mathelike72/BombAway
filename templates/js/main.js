const canvas = document.getElementById('game'); //Where the game is being displayed
const context = canvas.getContext('2d');
const grid = 64;
const numRows = 13;
const numCols = 15;
const softWallCanvas = document.createElement('canvas');

// canvas for ubrakable bricks
const wallCanvas = document.createElement('canvas');
const wallCtx = wallCanvas.getContext('2d');
wallCanvas.width = wallCanvas.height = grid;

wallCtx.fillStyle = 'black';
wallCtx.fillRect(0, 0, grid, grid);
wallCtx.fillStyle = 'white';
wallCtx.fillRect(0, 0, grid -2, grid - 2);
wallCtx.fillStyle = 'gray';
wallCtx.fillRect(2, 2, grid - 4, grid - 4);

// create a mapping of object types
const types = {
  wall: '▉',

};

let entities = [];

let cells = [];
const template = [
  ['▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉'],
  ['▉',    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,    ,   ,  ,'▉'],
  ['▉',    ,'▉',     ,'▉',    ,'▉',    ,'▉',   ,'▉',    ,'▉',  ,'▉'],
  ['▉',  ,   ,   ,   ,   ,    ,    ,    ,    ,     ,     ,   ,   ,   '▉'],
  ['▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,     '▉'],
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,          '▉'],
  ['▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',  ,      '▉'],
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,          '▉'],
  ['▉',   ,'▉',    ,'▉',    ,'▉',     ,'▉',     ,'▉',  ,'▉',   ,'▉'],
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,          '▉'],
  ['▉',  ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',    ,     '▉'],
  ['▉',   ,  ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,      ,       '▉'],
  ['▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉']
];

// populate the level with walls
function generateLevel() {
  cells = [];

  for (let row = 0; row < numRows; row++) {
    cells[row] = [];

    for (let col = 0; col < numCols; col++) {

      if (template[row][col] === types.wall) {
        cells[row][col] = types.wall;
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
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }
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

  // update and render everything in the grid
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      switch(cells[row][col]) {
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
  // don't move the player if something is already at that position
  if (!cells[row][col]) {
    player.row = row;
    player.col = col;
  }
});



// start the game
generateLevel(); //Where the blocks spawn
requestAnimationFrame(loop); //