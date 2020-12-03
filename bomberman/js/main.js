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
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,      ,       '▉'],
  ['▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉']
];

// For hard and soft walls
function generateBlocks() {
  cells = [];

  for (let row = 0; row < numRows; row++) {
    cells[row] = [];

    for (let col = 0; col < numCols; col++) {

      // 90% chance cells will contain a soft wall
      if (!template[row][col] && Math.random() < 0.80) {
        cells[row][col] = types.softWall;
      }
      else if (template[row][col] === types.wall) {
        cells[row][col] = types.wall;
      }
    }
  }
}


// loop for the game
let last;
let dt;
function loop(timestamp) {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // passes the current timestamp as a parameter to the loop / Übergibt den aktuellen Zeitstempel als Parameter an die Schleife
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
}

// start the game
generateBlocks(); //generate the blocks
requestAnimationFrame(loop); //