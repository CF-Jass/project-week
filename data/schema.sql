DROP DATABASE cfjazz;
CREATE DATABASE cfjazz;

\c cfjazz

CREATE TABLE highscores (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  date VARCHAR(255),
  score BIGINT
);

-- INSERT INTO highscores (username, date, score) VALUES ('User1', '09/01/2019', '10000');
-- INSERT INTO highscores (username, date, score) VALUES ('User2', '09/01/2019', '9500');
-- INSERT INTO highscores (username, date, score) VALUES ('User3', '09/01/2019', '1500');
-- INSERT INTO highscores (username, date, score) VALUES ('User4', '09/01/2019', '5000');
-- INSERT INTO highscores (username, date, score) VALUES ('User5', '09/01/2019', '4000');