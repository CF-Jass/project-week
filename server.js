'use strict';

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const app = express();
const methodOverride  = require('method-override');
require('dotenv').config();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', (error) => console.error(error));

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(methodOverride((request, response) => {
  if(request.body && typeof request.body === 'object' && '_method' in request.body){
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));


//routes
app.get('/', home);
app.get('/start', loadUsername);
app.post('/save-username', loadGame)
app.get('/quiz', loadGame);
app.post('/submit', validateAnswer);
app.get('/scores', loadScores);


app.get('*', (req, res) => { res.status(404).render('pages/error')});

//global vars
const dummyData = require('./data/dummyData.json');
let recentQuestion = [];
let numOfCorrectAnswers = 0;

//functions
function home(req, res) {
  recentQuestion = [];
  res.render('./pages/index');
}

function loadUsername(req, res) {
  res.render('./pages/username');
  // console.log(req.body);
}

function validateAnswer(req, res) {
  let selectedAnswer = req.body.answer
  if (selectedAnswer === 'yes') {
    numOfCorrectAnswers++;
  }
  res.redirect('/quiz');
}

let username;
function loadGame(req, res) {
  if (recentQuestion.length >= 20) {
    let sqlInsert = 'INSERT INTO highscores (username, date, score) VALUES ($1, $2, $3);'
    let sqlArray = [username, new Date(Date.now()).toDateString(), numOfCorrectAnswers]
    client.query(sqlInsert, sqlArray);
    recentQuestion = [];
    numOfCorrectAnswers = 0;
    res.redirect('/scores');
  } else {
    if (!username) {
      username = req.body.username;
    }
    let getRandomQuestion = getUniqueIndex();
    let singleQuestion = dummyData[getRandomQuestion];
    superagent
      .post('https://api.funtranslations.com/translate/yoda.json')
      .send({ text: singleQuestion.question })
      .set('X-Funtranslations-Api-Secret', process.env.YODA_API)
      .set('Accept', 'application/json')
      .then(responseFromSuper => res.render('./pages/trivia', {questionData: responseFromSuper.body.contents.translated, dummyData:singleQuestion, recentQuestion:recentQuestion, username:username }));
  }
}

function loadScores(req, res) {
  client.query('SELECT * FROM highscores ORDER BY score desc').then(resultFromSQL => {
    res.render('./pages/scores', {scores : resultFromSQL.rows});
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

//constructors

app.listen(PORT, () => console.log(`Server is live on ${PORT}`));