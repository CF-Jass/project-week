# Group Name: FULL-JASSED

## Creators: Susanna Lakey, Sarah Gilliam, Jon Veach, Adrian Huebner

### What this project is
* A place for Star Wars fans to congregate and play games with a Star Wars themes.
* This app contains the following games:
  * A trivia game with questions about Star Wars.  The game is timed and limited to a particular amount of questions.  All questions are filtered through the yoda speak API.
  * A Simon Says game. 
* When a user has completed a game they can share their score with friends and see a high score list.

### Library, Frameworks, and Packages Used:
* dotenv
* ejs
* express
* postgres
* sharer.js
* superagent
* Yoda translator API https://funtranslations.com/api/yoda

### Instructions to Get Program Running On Your Own Computer:
1. Clone the repository to your computer:
2. Install all dependencies by using the command ```npm install``` in your terminal.
3. Create your database and table with the steps in the schema.sql.
4. Set your port in a .env file.
5. Add your API key to the .env and set it equivalent to YODA_API.

### API Endpoints:
* Yoda translator API:
  * The endpoint for connecting: https://api.funtranslations.com/translate/
  * Example response:
    * When the question "C-3P0 is fluent in how many languages?" is entered it returns "C-3P0 fluent, in many languages is?"

### Conflict Resolution Plan
* Everyone stops coding as soon as there is a conflict
* If voting becomes tied, everyone talks about why they like what they voted for and then come to a middle ground as a group
* Raising concerns to people who are not contributing as much, talk as a group about where everyone and where are they stuck and see if other people in the group can help people get caught up
* If you individually have a problem with someone, find time to talk to them separately
* If it escalates to a bad point where nothing is getting accomplished, bring the problem to Nicholas or Lena

### Communication Plan
* Communicate after hours/weekend via Slack Group
* You can work as late as you want, just don’t push it
* Communicate what you are working on, what you are possibly changing about the code that is already existing
* Code Review every morning about what we did over the night for the project
* Group Stand-Up right before lunch break, where we can talk about where we are, what we did and where we were stuck at
* When pair programming add everyone’s names 

### User Stories

#### Star Wars Fans:
1. As a Star Wars fan, I want to learn different Star Wars facts so I can know more about the movies. 
 2. As a Star Wars fan, I want to compete with my friends to see who knows more about the franchise.
 3. As a Star Wars Fan, I want to be able to choose the difficulty of my trivia game so I can be more competitive
#### Trivia Fans:
 * As a trivia fan, I want to be able to  receive a variety of interesting trivia questions so I can learn more.
 * As a trivia fan, I want to have a set amount of time to finish the game in, so I feel challenged
 * As a trivia fan, I want to compete against my friends and compare high scores
 * As a trivia fan, I want to compete against myself and see my old scores.
#### Developer:
 * As a developer, I want to create a Star Wars themed trivia game that uses the yoda api to generate questions in yoda-speak.
* As a developer, I want to store user scores in a database so they can be rendered for the user to see later.
* As a developer I want to create a clean UI using css styling
 * As a developer, I want to pull my trivia questions by using the SWAPI to create interesting and challenging questions.
#### Game Website Owners:
 * As a game website owner, I want a trivia game related to the Star Wars franchise that will appeal to the fanbase
 * As a game website owner, I want the UI to present a Star Wars theme that is appealing to users.
 * As a game website owner, I want the user to have the ability to pick their trivia category.
 * As a game website owner, I want the user to have the ability to pick the difficulty of their trivia game.


#### Resources
https://www.gamespot.com/gallery/the-25-toughest-star-wars-trivia-questions-in-any-/2900-389/26/
https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
https://scotch.io/bar-talk/build-a-lightsaber-with-css-and-a-checkbox-solution-to-code-challenge-3
https://cssbuttoncreator.com/