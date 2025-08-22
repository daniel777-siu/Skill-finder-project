const express = require('express');
const cors = require('cors');
const path = require('path');

const usersRoutes = require('./routes/users.router');
const app = express()

app.use('/users', usersRoutes);

module.exports = app