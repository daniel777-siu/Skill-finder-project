const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONT_URL,
  credentials: true    
}));

app.use(express.json());


const usersRoutes = require('./routes/users.router');
const teamsRoutes = require ('./routes/teams.router');
const authRoutes = require('./routes/auth.router');
const languagueRouter = require('./routes/languagues.router');


app.use('/users', usersRoutes);
app.use('/teams', teamsRoutes);
app.use('/', authRoutes);
app.use('/languagues', languagueRouter);

module.exports = app;