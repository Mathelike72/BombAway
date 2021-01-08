setTimeout(function(){

const canvas = document.getElementById('game'); //Where the game is being displayed
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

const template2 = [
  ['▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉'],
  ['▉',   ,      ,   ,    ,    ,    ,    ,    ,    ,    ,'x', 'x','x','▉'],
  ['▉',    ,'▉',     ,'▉',    ,'▉',    ,'▉',   ,'▉',    ,'▉','x','▉'],
  ['▉',   ,   ,   ,   ,   ,    ,    ,    ,    ,     ,     ,   ,'x' , '▉'],
  ['▉',  ,'▉',  ,'▉',   ,'▉',    ,'▉',    ,'▉',  ,'▉',    ,     '▉'],
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,          '▉'],
  ['▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',  ,      '▉'],
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,          '▉'],
  ['▉',   ,'▉',    ,'▉',    ,'▉',     ,'▉',     ,'▉',  ,'▉',   ,'▉'],
  ['▉','x',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,          '▉'],
  ['▉','x','▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',    ,    '▉'],
  ['▉','x' ,'x', 'x',    ,   ,   ,   ,   ,   ,   ,   ,   ,      ,     '▉'],
  ['▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉']
];

const template = [
  ['▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉'],
  ['▉',   ,   ,   ,    ,    ,    ,    ,    ,    ,    ,'x', 'x' , 'x' ,'▉'],
  ['▉',   ,'▉',     ,'▉',    ,'▉',    ,'▉',   ,'▉',    ,'▉', 'x','▉'],
  ['▉',   ,   ,   ,   ,   ,    ,    ,    ,    ,     ,     ,     ,'x', '▉'],
  ['▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,     '▉'],
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,          '▉'],
  ['▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',  ,      '▉'],
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,          '▉'],
  ['▉',   ,'▉',    ,'▉',    ,'▉',     ,'▉',     ,'▉',  ,'▉',   ,'▉'],
  ['▉','x',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,          '▉'],
  ['▉','x','▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',    ,    '▉'],
  ['▉','x' ,'x', 'x',    ,   ,   ,   ,   ,   ,   ,   ,   ,      ,     '▉'],
  ['▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉']
];


// populate the level with walls
function generateLevel() {
  template.cells = [];

  for (let row = 0; row < numRows; row++) {
    template.cells[row] = [];

    for (let col = 0; col < numCols; col++) {

      // 80% chance cells turn soft wall
      if (template[row][col] !== types.wall && template[row][col] !== types.placeholder && template[row][col] !== types.powerUP && Math.random() < 0.8){
        template.cells[row][col] = types.swall;
        // template2.cells[row][col] = types.powerUP;
      }
      // All Walls on template to Walls. 
      else if (template[row][col] === types.wall) {
        template.cells[row][col] = types.wall;
      }
      // All Swalls on template to Swalls. 
      else if (template[row][col] === types.swall) {
      template.cells[row][col] = types.swall;
      }
<<<<<<< HEAD
      // All PowerUps on template to PowerUps. 
=======
      // All PowerUps on template to PowerUps. (Testing) 
>>>>>>> fdc396036d1502aa8f0de11d5006bab5463487e6
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
      if (!template[row][col] === types.swall && Math.random() < 0.2) {
        tamplate2.cells[row][col] = types.powerUp;
      }
    }
  }
}

// player character (just a simple circle)
const player = {
  row: 1,
  col: 13,
  radius: grid * 0.4,
  render() {
    const x = (this.col + 0.5) * 64;
    const y = (this.row + 0.5) * 64;

    context.save();
    context.fillStyle = 'yellow';
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }
}
// player character (just a simple circle)
const player2 = {
  row: 11,
  col: 1,
  radius: grid * 0.4,
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

// blow up a bomb and its surrounding tiles
function blowUpBomb(bomb) {

  // bomb has already exploded so don't blow up again
  if (!bomb.alive) return;

  bomb.alive = false;

  // remove bomb from grid
  cells[bomb.row][bomb.col] = null;

  // explode bomb outward by size
  const dirs = [{
    // up
    row: -1,
    col: 0
  }, {
    // down
    row: 1,
    col: 0
  }, {
    // left
    row: 0,
    col: -1
  }, {
    // right
    row: 0,
    col: 1
  }];

  dirs.forEach((dir) => {
    for (let i = 0; i < bomb.size; i++) {
      const row = bomb.row + dir.row * i;
      const col = bomb.col + dir.col * i;
      const cell = cells[row][col];

      // stop the explosion if it hit a wall
      if (cell === types.wall) {
        return;
      }

      // center of the explosion is the first iteration of the loop
      entities.push(new Explosion(row, col, dir, i === 0 ? true : false));
      cells[row][col] = null;

      // bomb hit another bomb so blow that one up too
      if (cell === types.bomb) {

        // find the bomb that was hit by comparing positions
        const nextBomb = entities.find((entity) => {
          return (
            entity.type === types.bomb &&
            entity.row === row && entity.col === col
          );
        });
        blowUpBomb(nextBomb);
      }

      // stop the explosion if hit anything
      if (cell) {
        return;
      }
    }
  });
}

// bomb constructor function
function Bomb(row, col, size, owner) {
  this.row = row;
  this.col = col;
  this.radius = grid * 0.4;
  this.size = size;    // the size of the explosion
  this.owner = owner;  // which player placed this bomb
  this.alive = true;
  this.type = types.bomb;

  // bomb blows up after 3 seconds
  this.timer = 3000;

  // update the bomb each frame
  this.update = function(dt) {
    this.timer -= dt;

    // blow up bomb if timer is done
    if (this.timer <= 0) {
      return blowUpBomb(this);
    }

    // change the size of the bomb every half second. we can determine the size
    // by dividing by 500 (half a second) and taking the ceiling of the result.
    // then we can check if the result is even or odd and change the size
    const interval = Math.ceil(this.timer / 500);
    if (interval % 2 === 0) {
      this.radius = grid * 0.4;
    }
    else {
      this.radius = grid * 0.5;
    }
  };

  // render the bomb each frame
  this.render = function() {
    const x = (this.col + 0.5) * grid;
    const y = (this.row + 0.5) * grid;

    // draw bomb
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI);
    context.fill();

    // draw bomb fuse moving up and down with the bomb size
    const fuseY = (this.radius === grid * 0.5 ? grid * 0.15 : 0);
    context.strokeStyle = 'white';
    context.lineWidth = 5;
    context.beginPath();
    context.arc(
      (this.col + 0.75) * grid,
      (this.row + 0.25) * grid - fuseY,
      10, Math.PI, -Math.PI / 2
    );
    context.stroke();
  };
}

// explosion constructor function
function Explosion(row, col, dir, center) {
  this.row = row;
  this.col = col;
  this.dir = dir;
  this.alive = true;

  // show explosion for 0.3 seconds
  this.timer = 300;

  // update the explosion each frame
  this.update = function(dt) {
    this.timer -= dt;

    if (this.timer <=0) {
      this.alive = false;
    }
  };

  // render the explosion each frame
  this.render = function() {
    const x = this.col * grid;
    const y = this.row * grid;
    const horizontal = this.dir.col;
    const vertical = this.dir.row;

    // create a fire effect by stacking red, orange, and yellow on top of
    // each other using progressively smaller rectangles
    context.fillStyle = '#D72B16';  // red
    context.fillRect(x, y, grid, grid);

    context.fillStyle = '#F39642';  // orange

    // determine how to draw based on if it's vertical or horizontal
    // center draws both ways
    if (center || horizontal) {
      context.fillRect(x, y + 6, grid, grid - 12);
    }
    if (center || vertical) {
      context.fillRect(x + 6, y, grid - 12, grid);
    }

    context.fillStyle = '#FFE5A8';  // yellow

    if (center || horizontal) {
      context.fillRect(x, y + 12, grid, grid - 24);
    }
    if (center || vertical) {
      context.fillRect(x + 12, y, grid - 24, grid);
    }
  };
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
  player2.render();
}



// listen to keyboard events to move the player
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

  // don't move the player if something is already at that position
  if (template.cells[row][col] !== types.wall && template.cells[row][col] !== types.swall) {
    player.row = row;
    player.col = col;
  }
  // space key (bomb)
  else if (
  e.which === 32 && !cells[row][col] &&
  // count the number of bombs the player has placed
  entities.filter((entity) => {
    return entity.type === types.bomb && entity.owner === player
  }).length < player.numBombs
) {
  // place bomb
  const bomb = new Bomb(row, col, player.bombSize, player);
  entities.push(bomb);
  cells[row][col] = types.bomb;
  }
  // don't move the player if something is already at that position
  if (cells[row][col] !== types.wall && cells[row][col] !== types.swall && cells[row][col] !== types.bomb) {
    player.row = row;
    player.col = col;
  }
});

// listen to keyboard events to move the player
document.addEventListener('keydown', function(e) {
  let row = player2.row;
  let col = player2.col;

  // left arrow key
  if (e.which === 65) {
    col--;
  }
  // up arrow key
  else if (e.which === 87) {
    row--;
  }
  // right arrow key
  else if (e.which === 68) {
    col++;
  }
  // down arrow key
  else if (e.which === 83) {
    row++;
  }
  // placing bomb
  else if (e.which === 32){
    bombe ();
  }
  // don't move the player if something is already at that position
  if (template.cells[row][col] !== types.wall && template.cells[row][col] !== types.swall) {
    player2.row = row;
    player2.col = col;
  }
  // space key (bomb)
  else if (
  e.which === 16 && !cells[row][col] &&
  // count the number of bombs the player has placed
  entities.filter((entity) => {
    return entity.type === types.bomb && entity.owner === player
  }).length < player.numBombs) {
  // place bomb
  const bomb = new Bomb(row, col, player.bombSize, player);
  entities.push(bomb);
  cells[row][col] = types.bomb;
  }
  // don't move the player if something is already at that position
  if (cells[row][col] !== types.wall && cells[row][col] !== types.swall && cells[row][col] !== types.bomb)  {
    player2.row = row;
    player2.col = col;
  }
});


// start the game
generateLevel(); //Where the blocks spawn
generateLevelback() //background arbeit
requestAnimationFrame(loop); //
}, 100);