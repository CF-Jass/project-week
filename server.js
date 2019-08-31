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

//functions


//constructors

app.listen(PORT, () => console.log(`Server is live on ${PORT}`));