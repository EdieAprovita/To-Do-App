require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const colors = require('colors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((x) =>
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`.cyan
        .underline.bold
    )
  )
  .catch((err) => console.error('Error connecting to mongo', err.red));

const app_name = require('./package.json').name;
const debug = require('debug')(
  `${app_name}:${path.basename(__filename).split('.')[0]}`
);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTENDPOINT],
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));

app.use(
  require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true,
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2)
    throw new Error('Handlebars Helper ifUndefined needs 1 parameter');
  if (typeof value !== undefined) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

app.use(
  session({
    secret: 'vegan',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(flash());
require('./passport')(app);

const index = require('./routes/index');
app.use('/', index);

const todo = require('./routes/todo-routes');
app.use('/api', todo);

const auth = require('./routes/auth');
app.use('/auth', auth);

// Uncomment this line for production
// app.get('/*', (req, res) => res.sendFile(__dirname + '/public/index.html'));

module.exports = app;
