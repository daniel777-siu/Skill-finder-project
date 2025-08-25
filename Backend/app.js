const express = require('express');
const cors = require('cors');
const path = require('path');

const usersRoutes = require('./routes/users.router');
const teamsRoutes = require ('./routes/teams.router');
const app = express();

app.use('/users', usersRoutes);
app.use('/teams', teamsRoutes);

module.exports = app;