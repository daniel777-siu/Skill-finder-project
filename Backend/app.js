const express = require('express');
const cors = require('cors');
const path = require('path');


const usersRoutes = require('./routes/users.router');
const teamsRoutes = require ('./routes/teams.router');
const authRoutes = require('./routes/auth.router')
const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/teams', teamsRoutes);
app.use('/', authRoutes);

module.exports = app;