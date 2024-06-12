const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');

const usersRouter = require('./routes/users.router.js');
const petsRouter = require('./routes/pets.router.js');
const adoptionsRouter = require('./routes/adoption.router.js');
const sessionsRouter = require('./routes/sessions.router.js');
const { MONGO_URL, PORT } = require('./config/config.js');
const { viewsRouter } = require('./routes/views.router.js');
const path = require('path');


const app = express();
const connection = mongoose.connect(MONGO_URL)

// VIEW ENGINE CONFIG
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Public Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter)

app.listen(PORT, () => console.log(`Running on port ${PORT}`))
