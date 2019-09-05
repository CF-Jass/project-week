'use strict';

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const app = express();
const methodOverride = require('method-override');
require('dotenv').config();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', (error) => console.error(error));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));


//routes
app.get('/', home);
app.get('/gamepage', loadGamePage)
app.get('/quiz', loadGame);
app.post('/submit', validateAnswer);
app.get('/scores', loadScores);
app.get('/trivia', loadGame);
app.get('/simon', loadSimon);
app.get('/board', loadBoard);
app.get('/boardresult', loadBoardResult);
app.get('/aboutus', loadAboutUs);


// Input {username: george, score: 5, game: 'trivia'}
app.post('/addScore', addScore);


app.get('*', (req, res) => { res.status(404).render('pages/error') });

//global vars
const dummyData = require('./data/dummyData.json');
let recentQuestion = [];
let numOfCorrectAnswers = 0;

//functions
function home(req, res) {
  recentQuestion = [];
  res.render('./pages/index');
}

function loadAboutUs(req, res) {
  res.render('./pages/aboutus');
}

function validateAnswer(req, res) {
  const username = req.body.username;
  let selectedAnswer = req.body.answer;
  if (selectedAnswer === 'yes') {
    numOfCorrectAnswers++;
  }
  res.redirect('/quiz?username=' + username);
}

function loadGamePage(req, res) {
  res.render('./pages/gamepage', { username: req.query.username });
}

function loadSimon(req, res) {
  res.render('./pages/simon')
}

function loadBoard(req, res) {
  res.render('./pages/board')
}

function loadBoardResult(req, res) {
  res.render('./pages/boardresult')
}

function addScore(req, res) {
  //let sqlInsert = 'INSERT INTO highscores (username, date, score, game) VALUES ($1, $2, $3, $4);'
  console.log('updateAndViewScores called: ', req.body);
  let sqlInsert = 'INSERT INTO highscores (username, date, score) VALUES ($1, $2, $3);';
  let sqlArray = [
    req.body.username,
    new Date(Date.now()).toDateString(),
    req.body.score //,
    //req.body.game
  ];
  client.query(sqlInsert, sqlArray);
  res.sendStatus(200);
}

function loadGame(req, res) {
  if (recentQuestion.length >= 20) {
    let sqlInsert = 'INSERT INTO highscores (username, date, score) VALUES ($1, $2, $3);'
    let sqlArray = [req.query.username, new Date(Date.now()).toDateString(), numOfCorrectAnswers]
    client.query(sqlInsert, sqlArray);
    recentQuestion = [];
    numOfCorrectAnswers = 0;
    res.redirect('/scores');
  } else {
    // console.log(`Length is ${recentQuestion.length}, Our recent question array is ${recentQuestion}`)
    // console.log(`username is ${username}`)
    // console.log()
    console.log(newUser);
    let getRandomQuestion = getUniqueIndex();
    let singleQuestion = dummyData[getRandomQuestion];
    superagent
      .post('https://api.funtranslations.com/translate/yoda.json')
      .send({ text: singleQuestion.question })
      .set('X-Funtranslations-Api-Secret', process.env.YODA_API)
      .set('Accept', 'application/json')
      .then(responseFromSuper => res.render('./pages/trivia',
        { 
          questionData: responseFromSuper.body.contents.translated,
          dummyData: singleQuestion,
          recentQuestion: recentQuestion
        }));
  }
}

function loadScores(req, res) {
  client.query('SELECT * FROM highscores ORDER BY score desc').then(resultFromSQL => {
    res.render('./pages/scores', { scores: resultFromSQL.rows });
  })
}

//helper functions
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getUniqueIndex() {
  let randomIndex = getRandomNumber(0, dummyData.length - 1);
  while (recentQuestion.includes(randomIndex)) {
    randomIndex = getRandomNumber(0, dummyData.length);
  }
  if (recentQuestion.length > dummyData.length) {
    recentQuestion.shift();
  }
  recentQuestion.push(randomIndex);
  return randomIndex;
}

function userData(username) {
  this.username = username;
  this.bananas = 'bananas';
}


app.listen(PORT, () => console.log(`Server is live on ${PORT}`));
