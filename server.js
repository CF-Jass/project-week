'use strict';

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', (error) => console.error(error));

app.use(express.static('./public'));

//routes
app.get('/trivia', renderQuestion);


//constructors

// function Question(category, type, difficulty, question, correct_answer, answers) {
//   this.category = category;
//   this.type = type;
//   this.difficulty = difficulty;
//   this.question = question;
//   this.correct_answer = correct_answer;
//   this.answers = answers;
// }

//functions

// Find way to keep same question from appearing again
function renderQuestion(request, response) {
  try {
    const questionData = require('./data/trivia.json');
    const randomQuestion = getRandomArrayEntry(questionData.trivia);
    const randomizedAnswers = shuffleArray(randomQuestion.answers);
    console.log('randomized answers', randomizedAnswers);
    superagent
      .post('https://api.funtranslations.com/translate/yoda.json')
      .send({ text: randomQuestion.question })
      .set('X-Funtranslations-Api-Secret', process.env.YODA_API)
      .set('Accept', 'application/json')
      .then(res => {
        console.error('yay got ' + JSON.stringify(res.body.contents.translated));
        response.render('./pages/trivia', { questionData: res.body.contents.translated, answers: randomizedAnswers });
      });

  } catch (error) {
    console.error(error);
    response.status(500).send('Something went wrong!');
  }
}

function getRandomArrayEntry(array) {
  const randomEntry = array[Math.floor(Math.random() * array.length)];
  return randomEntry;
}

function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

app.listen(PORT, () => console.log(`Server is live on ${PORT}`));
