'use strict';

// SIMON CONSTRUCTOR //
function SimonGame (highlightMs, delayMs){
  this.isRunning = false;
  this.challengeArr = [];
  this.playerClicksArr = [];
  this.highlightMs = highlightMs;
  this.delayMs = delayMs;
  this.points = 0;
  this.buttons = [
    new SimonButton($('#simon_top_left').first(), this),
    new SimonButton($('#simon_top_right').first(), this),
    new SimonButton($('#simon_bottom_left').first(), this),
    new SimonButton($('#simon_bottom_right').first(), this),
  ];
}

SimonGame.prototype.start = function (){
  this.isRunning = true;
  this.points = 0;
  this.updatePoints();
  this.challengeArr = [];
  this.nextRound();
}

// This adds another button to the cycle
SimonGame.prototype.nextRound = function (){
  this.playerClicksArr = [];
  let selectedButtonIndex = Math.floor(Math.random() * this.buttons.length);
  this.challengeArr.push(this.buttons[selectedButtonIndex]);
  this.presentChallenge(this.challengeArr, 0);
}

// This presents the challenge to the player using recursion
// while the currentIndex is >= the challenge array that is passed in.
SimonGame.prototype.presentChallenge = function (arr, currentIndex){
  if(currentIndex >= arr.length){
    return;
  }
  arr[currentIndex].highlight(() => {
    setTimeout(() => {
      this.presentChallenge(arr, currentIndex+1);
    }, this.delayMs);
  })
}

// This is used to verify the players clicks against the challenges clicks in the array
SimonGame.prototype.verifyOrder = function (){
  if(this.playerClicksArr.length > this.challengeArr.length){
    return false;
  }
  for (let i=0; i<this.playerClicksArr.length; i++){
    if(this.playerClicksArr[i] !== this.challengeArr[i]){
      return false;
    }
  }
  return true;
}

// When the player loses, we want to updated the sccore by posting to /addscore
// then on done, we want to change to the /scores page.
SimonGame.prototype.lose = function() {
  this.isRunning = false;
  $.post('/addScore', {
    username: window.localStorage.getItem('username'),
    game: 'simon',
    score: this.points
  }).done(() => { console.log('done!'); window.location.pathname = '/scores'; });
}

// We want there to always be 4 digits on the score
SimonGame.prototype.updatePoints = function (){
  $('#simon_points').text(this.points.toString().padStart(4, '0'));
}


// SIMON BUTTON CONSTRUCTOR //
function SimonButton (buttonEl, game){
  this.buttonEl = buttonEl;
  this.game = game;
  buttonEl.on('click', (e) => {
    if(!this.game.isRunning){
      return;
    }
    this.highlight(() => {
      this.game.playerClicksArr.push(this);
      if(!this.game.verifyOrder()){
        this.game.lose();
      } else if(this.game.playerClicksArr.length === this.game.challengeArr.length) {
        setTimeout(() => {
          this.game.points += this.game.challengeArr.length;
          this.game.updatePoints();
          this.game.nextRound();
        }, this.game.delayMs*2);
      }
    });
  });
}

// We want to light up the button, and also remove the class that lights it up while using the highlightMS.
SimonButton.prototype.highlight = function (onHightlightDone){
  const button = this;
  button.buttonEl.addClass('simon_button_lit');
  setTimeout(() => {
    button.buttonEl.removeClass('simon_button_lit');
    onHightlightDone();
  }, button.game.highlightMs);
}

// New instance with highlighted MS and the delay MS
var simon = new SimonGame(500, 250);

// Start button
$('#simon_start_button').on('click', () => {simon.start()});
