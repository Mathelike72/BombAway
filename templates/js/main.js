setTimeout(function(){

  const canvas = document.getElementById('game'); //Where the game is being displayed
  const context = canvas.getContext('2d');
  const grid = 64;
  const numRows = 13;
  const numCols = 15;
  
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
  
  // numberBomb
  const numberBombUpCanvas = document.createElement('canvas');
  const numberBombUpCtx = numberBombUpCanvas.getContext("2d");
  numberBombUpCanvas.width = numberBombUpCanvas.height = grid;
  
  numberBombUpCtx.fillStyle = 'black';
  numberBombUpCtx.beginPath();
  numberBombUpCtx.arc(grid/2, grid/2, grid*0.3 , 0, 2 * Math.PI);
  numberBombUpCtx.fill();
  
  numberBombUpCtx.strokeStyle = 'grey';
  numberBombUpCtx.lineWidth = 5;
  numberBombUpCtx.beginPath();
  numberBombUpCtx.arc( grid-20, grid -45, 10, Math.PI, -Math.PI / 2
  );
  numberBombUpCtx.stroke();
  
  //bombsize
  const bombSizeUpCanvas = document.createElement('canvas');
  const bombSizeUpCtx = bombSizeUpCanvas.getContext('2d');
  bombSizeUpCanvas.width = bombSizeUpCanvas.height = grid;
  
  bombSizeUpCtx.fillStyle = 'darkred';
  bombSizeUpCtx.fillRect(grid/2-grid/12, grid/10, grid/6, grid-grid/5);
  bombSizeUpCtx.fillStyle = 'darkred';
  bombSizeUpCtx.fillRect(grid/10, grid/2-grid/12, grid-grid/5, grid/6);
  
  const types = {
    wall: '▉',
    bomb: 2,
    swall: 1,
    numberBombUp:3,
    bombSizeUp:4,
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
  
  
  // populate the level with objects
  function generateLevel() {
    cells = [];
  
    for (let row = 0; row < numRows; row++) {
      cells[row] = [];
  
      for (let col = 0; col < numCols; col++) {
  
        // 80% chance cells turn soft wall
        if (!template[row][col] &&  Math.random() < 0.7){
          cells[row][col] = types.swall;
        }
        // All Walls on template to Walls. 
        else if (template[row][col] === types.wall) {
          cells[row][col] = types.wall;
        }
      }
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
  
        function TestPlayer(player, col ,row) {                             //#ajouté#
          return player.col === col && player.row === row;                //   |
      }                                                                   //   |
  
      if (cell === types.swall){
  
          // 18% chance qu'une cellule contienne un power up
          if (!template[row][col] && Math.random() < 0.18){
              console.log("bombSize power up apparu");
              cells[row][col] = types.numberBombUp;
          }
  
          else if (!template[row][col] && Math.random() < 0.15) { //18%
              console.log("numberSize power up apparu");
              cells[row][col] = types.bombSizeUp;
          }
          //         else if (!template[row][col] && Math.random() < 0.4) { //5%
          //             cells[row][col] = types.piercingBomb;
          //         )
      }
  
  
  
      if (TestPlayer(player1, col, row)) {                                //#ajouté#
          console.log("1 got exploded.");                                 //  |
          player1.reset();                                                //  V
          player2.reset();
          generateLevel();
      }
      if (TestPlayer(player2, col, row)) {
          console.log("2 got exploded.");
          player1.reset();
          player2.reset();
          generateLevel();                                                //  A
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
  
  
  // player character (just a simple circle)
  const player1 = {
    row: 1,
    col: 13,
    numBombs: 1,
    bombSize: 2,
    radius: grid * 0.4,
    reset() {
      window.open("http://localhost:2020/player_1_won");
    },
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
    numBombs: 1,
    bombSize: 2,
    radius: grid * 0.4,
    reset() {
      window.location.assign("{{url_for('player_1_won', filename='player_1_won.html')}}");
    },
    render() {
      const x = (this.col + 0.5) * 64;
      const y = (this.row + 0.5) * 64;
  
      context.save();
      context.fillStyle = 'white';
      context.beginPath();
      context.arc(x, y, this.radius, 0, 2 * Math.PI);
      context.fill();
    }
  };
  
  
  
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
        switch(cells[row][col]) {
          case types.wall:
            context.drawImage(wallCanvas, col * grid, row * grid);
            break;
          case types.swall:
            context.drawImage(swallCanvas, col * grid, row * grid);
            break;
          case types.numberBombUp:                                                     //#ajouté#
              context.drawImage(numberBombUpCanvas, col * grid, row * grid);          //  |
              break;                                                                  //  V
          case types.bombSizeUp:
              context.drawImage(bombSizeUpCanvas, col * grid, row * grid);            //  A
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
  
    player1.render();
    player2.render();
  }
  
  
  
  // listen to keyboard events to move the player
  document.addEventListener('keydown', function(e) {
    let row1 = player1.row;
    let col1 = player1.col;
  
    // left arrow key
    if (e.which === 37) {
      col1--;
    }
    // up arrow key
    else if (e.which === 38) {
      row1--;
    }
    // right arrow key
    else if (e.which === 39) {
      col1++;
    }
    // down arrow key
    else if (e.which === 40) {
      row1++;
    }
   // space key (bomb)
   else if (
    e.which === 32 && !cells[row1][col1] &&
    // count the number of bombs the player has placed
    entities.filter((entity) => {
      return entity.type === types.bomb && entity.owner === player1
    }).length < player1.numBombs
  ) {
    // place bomb
    const bomb = new Bomb(row1, col1, player1.bombSize, player1);
    entities.push(bomb);
    cells[row1][col1] = types.bomb;
    }
  
    // don't move the player if something is already at that position
    if (!cells[row1][col1]) {
      player1.row = row1;
      player1.col = col1;
    }
  
    else if (cells[row1][col1] === types.numberBombUp){
      console.log("numberBombUp ramasse");
      cells[row1][col1] = 0;
      player1.row = row1;
      player1.col = col1;
      player1.numBombs++;
  }
  
  else if (cells[row1][col1] === types.bombSizeUp){
      console.log("numberBombUp ramasse");
      cells[row1][col1] = 0;
      player1.row = row1;
      player1.col = col1;
      player1.bombSize++;     
  }});
  
  document.addEventListener('keydown', function(e){
    let row2 = player2.row;
    let col2 = player2.col;
  
    // left arrow key
    if (e.which === 65) {
      col2--;
    }
    // up arrow key
    else if (e.which === 87) {
      row2--;
    }
    // right arrow key
    else if (e.which === 68) {
      col2++;
    }
    // down arrow key
    else if (e.which === 83) {
      row2++;
    }
  
    // x key (Bomb)
   else if (
    e.which === 88 && !cells[row2][col2] &&
    // count the number of bombs the player has placed
    entities.filter((entity) => {
      return entity.type === types.bomb && entity.owner === player2
    }).length < player2.numBombs
  ) {
    // place bomb
    const bomb = new Bomb(row2, col2, player2.bombSize, player2);
    entities.push(bomb);
    cells[row2][col2] = types.bomb;
    }
  
  
    // don't move the player if something is already at that position
     if (!cells[row2][col2])  {
      player2.row = row2;
      player2.col = col2;
    }
    else if (cells[row2][col2] === types.numberBombUp){
      console.log("numberBombUp ramasse");
      cells[row2][col2] = 0;
      player2.row = row2;
      player2.col = col2;
      player2.numBombs++;
  }
  else if (cells[row2][col2] === types.bombSizeUp){
      console.log("numberBombUp ramasse");
      cells[row2][col2] = 0;
      player2.row = row2;
      player2.col = col2;
      player2.bombSize++;
  }    
  });
  
  // start the game
  generateLevel(); //Where the blocks spawn
  requestAnimationFrame(loop);
  }, 100);