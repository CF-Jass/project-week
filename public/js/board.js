'use strict';

const grid = $('#four_in_a_row_grid');
const numRows = 7;
const numCols = 5;
const maxInARow = 5;
const useAIForSecondPlayer = true;
const absurdlyBig = 9999999;

// There are 2 directions in every line.
// In horizontal line, there is left right
// In vertical line, there is up down
// In diagonal forward, there is upright and leftdown
// In diagonal backwards, there is upleft and downright
const lines = [
  [
    { row: 0, col: 1 }, // RIGHT
    { row: 0, col: -1 }, // LEFT
  ],
  [
    { row: 1, col: 0 }, // DOWN
    { row: -1, col: 0 }, // UP
  ],
  [
    { row: 1, col: 1 }, // DOWN RIGHT
    { row: -1, col: -1 }, // UP LEFT
  ],
  [
    { row: -1, col: 1 }, // UP RIGHT
    { row: 1, col: -1 }, // DOWN LEFT
  ]
];

let allCells = [];
let currentPlayer = 0;
let isGameRunning = false;
let container = document.getElementById('four_in_a_row_container');
let leaderboard = document.getElementById('leaderboard');
let leaderboardMessage = document.getElementById('leaderboardMessage');
let imageSlideInYoda = document.getElementById('imageSlideInYoda');

function initBoard() {
  for (let r = 0; r < numRows; r++) {
    let trEl = document.createElement('tr');
    trEl.classList.add('gridRow');

    for (let c = 0; c < numCols; c++) {
      let tdEl = document.createElement('td');
      tdEl.classList.add('gridCell');
      allCells.push(tdEl);
      tdEl.setAttribute('id', getCellID(r, c));
      tdEl.addEventListener('click', handleCellClick);
      trEl.appendChild(tdEl);
    }
    grid.append(trEl);
  }
  startGame();
}

function startGame(){
  isGameRunning = true;
  currentPlayer = 0;
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      let tdEl = getCell(r, c);
      tdEl.classList.remove('cellPlayer_0');
      tdEl.classList.remove('cellPlayer_1');
      tdEl.location = { row: r, col: c };
      tdEl.player = null;
    }
  }
}

function nextPlayer() {
  if (currentPlayer === 0) {
    currentPlayer = 1;
    if (useAIForSecondPlayer) {
      playAITurn();
    }
  } else if (currentPlayer === 1) {
    currentPlayer = 0;
  }
}

// this is the id for the dom element at r and c
function getCellID(r, c) {
  return 'row_' + r + '_cell_' + c;
}

// returns the dom element or null if no such cell exist
function getCell(r, c) {
  return document.getElementById(getCellID(r, c));
}

function checkForWin(cellEl) {
  let sourceLocation = cellEl.location;
  let sourcePlayer = cellEl.player;
  for (let l = 0; l < lines.length; l++) {
    let currentLine = lines[l];
    let winningCells = [cellEl];
    // There are 2 directions in every line (e.g. left/right in horizontal)
    for (let directionNum = 0; directionNum < 2; directionNum++) {
      let currentDirection = currentLine[directionNum];

      // We start from distance 1 (which are the cells around the sourceLocation)
      // and we go further away in the direction we are testing
      // so distance = 1, means the adjacent cell in the direction we are testing
      // distance = 2 means one cell afterwards
      // we skip distance 0, which is the originating cell, we already counted it by putting it
      // inside the winningCells array above
      for (let distance = 1; distance < Math.max(numRows, numCols); distance++) {
        // All directions are always zeroes and ones. 0 is no change, 1/-1 is change
        const adjRow = sourceLocation.row + (currentDirection.row * distance);
        const adjCol = sourceLocation.col + (currentDirection.col * distance);
        let elToCheck = getCell(adjRow, adjCol);
        if (elToCheck === null || elToCheck.player === null || elToCheck.player !== sourcePlayer) {
          break;
        } else if (elToCheck.player === sourcePlayer) {
          winningCells.push(elToCheck);
        }
      }
    }

    // finished going in that line in both directions for the distance we needed
    if (winningCells.length >= maxInARow) {
      console.log(winningCells);
      return true;
    }
  }

  return false;
}

// if we click on a cell
function handleCellClick(event) {
  if(!isGameRunning){
    return;
  }
  let cellEl = event.target;

  // if it already has a player, then we return and ignore the click
  if (cellEl.player !== null) {
    return;
  }

  playCell(cellEl);
}

function playCell(cellEl) {
  // otherwise we claim the cell by setting the player and adding a class
  cellEl.player = currentPlayer;
  cellEl.classList.add('cellPlayer_' + currentPlayer);

  // check if after playing there is a win
  if (checkForWin(cellEl)){
    isGameRunning = false;
    setTimeout(()=> {
      if (currentPlayer === 0) {
        // human won
        bringDownYodaWin();
      } else {
        // computer won
        bringDownYodaLose();
      }
    }, 500);
  }
  else {
    nextPlayer();
  }
}

function playAITurn() {
  // Here we are going to keep an array of all our possible moves and their score
  // then we will sort it by the score and play the best move
  let scoresForMoves = [];

  // Go over all the cells
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const cellEl = getCell(r, c);
      if (cellEl.player !== null) {
        // The cell is not empty, no point in considering using it
        continue;
      }

      // For the cell, check up to the 8 cells around it
      // We only want to play cells that are adjacent to other occupied cells
      if (!isAdjacentToOccupied(r,c)) {
        continue;
      }

      // So now we are in an open cell that is adjacent
      // to an occupied one!
      // PRETEND WE TAKE IT FOR OURSELVES
      cellEl.player = 1;

      // See how we like the board and save the score of this move for later
      const score = seeHowWeLikeThisBoardNow();
      scoresForMoves.push({row: r, col: c, score: score});

      // Taking back our pretended move, clearing that cell
      cellEl.player = null;
    }
  }

  if (scoresForMoves.length === 0) {
    setTimeout(()=> {
      bringDownYodaLose();
    }, 300)
    return;
  }

  // Sort all the scores for moves based on the score
  // Highest score first
  scoresForMoves.sort((a,b) => b.score - a.score);
  const bestMove = scoresForMoves[0];
  const bestCellToPlay = getCell(bestMove.row, bestMove.col);
  setTimeout(()=> {
    playCell(bestCellToPlay);
  }, 700)
  // playCell(bestCellToPlay);
}

function isAdjacentToOccupied(row, col) {
  // For every direction
  for (let l = 0; l < lines.length; l++) {
    const currentLine = lines[l];
    // CurrentLine for example is "Up Down"
    // [
    //   { col: 0, row: -1}, // up
    //   { col: 0, row: 1}  // down
    // ]
    for (let d = 0; d < currentLine.length; ++d) {
      const currentDir = currentLine[d];
      // So this is one of the 8 directions
      const adjRow = row + currentDir.row;
      const adjCol = col + currentDir.col;

      const adjCell = getCell(adjRow, adjCol);
      // If it's not outside of the board and it has a player set on it
      if (adjCell !== null && adjCell.player !== null) {
        return true;
      }
    }
  }
  // We finished looking all around and found no cell that is occupied
  return false;
}

// returns a score of how much we like this board
// The higher the score, the better it is for us - the AI
// The lower the score, the better it is for the human player
function seeHowWeLikeThisBoardNow() {
  const humanScore = getScoreForPlayer(0);
  const computerScore = getScoreForPlayer(1);
  return computerScore - humanScore;
}

// This will give me a number, the higher it is, the better it is for player
// for example, if he is almost completing a 4 in a row, it will be REALLY high
//
// A score for a player, is the sum of all the scores of all the cells for the player
function getScoreForPlayer(player) {
  // examples of situations
  // enemey,player,player,enemey .... then this is worth nothing to the player
  // empty,player,player,empty ... that's fairly good
  // enemey,player,player,empty .. that's .. okayish.. better than locked

  let overall_board_score_for_player = 0;
  // Go over all the cells
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const cellEl = getCell(r, c);
      if (cellEl.player !== player) {
        // I only care about cells that belong to player, which I'm scoring
        continue;
      }

      const cellscore = getScoreForPlayerForCell(cellEl);
      overall_board_score_for_player += cellscore;
    }
  }
  return overall_board_score_for_player;
}

// This simple scoring function only looks at streaks and so if someone
// plays with a gap on purpose, it will outsmart the scoring
function getScoreForPlayerForCell(cellEl) {
  let result_score = 0;
  let sourceLocation = cellEl.location;
  let sourcePlayer = cellEl.player;
  for (let l = 0; l < lines.length; l++) {
    let currentLine = lines[l];
    let winningCells = [cellEl];

    // For every direction, apart from the streak array we also keep
    // an array of "holes" that are still playable
    let playableCells = []; // This does not exist in checkForWin
    for (let directionNum = 0; directionNum < currentLine.length; directionNum++) {
      let currentDirection = currentLine[directionNum];

      for (let distance = 1; distance < Math.max(numRows, numCols); distance++) {
        const adjRow = sourceLocation.row + (currentDirection.row * distance);
        const adjCol = sourceLocation.col + (currentDirection.col * distance);

        // Get a cell which is around the center cell
        let elToCheck = getCell(adjRow, adjCol);
        if (elToCheck === null) {
          break; // Outside the board
        } else if (elToCheck.player === null) {
          // If it's empty, I can still play it
          playableCells.push({row: adjRow, col: adjCol});

          // If this is the first "hole" we encounter, try to pretend it's not
          // the end of the streak by not breaking
          if (playableCells.length >= 2) { // in checkForWin, we always break here
            break;
          }
        } else if (elToCheck.player !== sourcePlayer) {
          // It belongs to the enemey player, no point checking for a possible stream
          break;
        } else if (elToCheck.player === sourcePlayer) {
          // It's part of our streak
          winningCells.push(elToCheck);
        }
      }
    }

    // winningCells.length are the current streak I have
    // playableCells.length are my "options" to continue it (between 0 and 2)
    // if playable length is 0.. this is worth nothing to me
    // if playable cells is 1.. it's okayish but if it's 2.. it's good for me I can play both sides
    if (winningCells.length === maxInARow) {
      // This is our winning move. we should do it no doubt
      return absurdlyBig;
    }

    // If this move brings us to a "3" with an option for 4 the following turn
    // then it's a great move, but still a thousand times worse than winning
    if (winningCells.length === (maxInARow - 1) && playableCells.length > 0) {
      return absurdlyBig/1000;
    }

    // Otherwise, a good ove is a move that has a longer streak with more playable options
    // 0 playable cells is 0 score for the move because we will never be able to get a 4
    result_score += winningCells.length * playableCells.length;
  }

  return result_score;
}

function bringDownYodaWin(){
  leaderboard.style.top = '95px';
  leaderboardMessage.innerHTML = 'Win, you have.';
  container.style.opacity = '0.4'; // we want to make the wheel darker so the leaderboard drop down shows up better.
}

function bringDownYodaLose(){
  leaderboard.style.top = '95px';
  leaderboardMessage.innerHTML = 'Try again, you must.';
  container.style.opacity = '0.4'; // we want to make the wheel darker so the leaderboard drop down shows up better.
}


initBoard();
