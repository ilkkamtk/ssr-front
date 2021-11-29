'use strict';
const dotenv = require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const session = require('express-session');
const MariaStore = require('express-session-mariadb-store');
const FormData = require('form-data');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  login,
  checkToken,
  getCats,
  getCat,
  getUsers,
  addCat,
} = require('./utils/api');
const app = express();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  require('./utils/production')(app, process.env.PORT, process.env.HTTPS_PORT);
} else {
  require('./utils/localhost')(app, process.env.PORT);
}

const checkLogin = async (req, res, next) => {
  const user = await checkToken(req.session.token);
  if (user) {
    req.session.user = user;
    next();
  } else {
    res.redirect('./login');
  }
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    store: new MariaStore({
      host: process.env.DB_HOST,
      sessionTable: 'wop_session',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('./login');
});

app.post('/auth', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const response = await login(username, password);
  console.log('response', response);
  if (response) {
    req.session.user = response.user;
    req.session.token = response.token;
    res.redirect('/');
  } else {
    res.redirect('./login');
  }
});

app.post('/save-cat', checkLogin, upload.single('cat'), async (req, res) => {
  console.log('req.body', req.body, req.file);
  const data = new FormData();
  data.append('cat', req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });
  data.append('name', req.body.name);
  data.append('birthdate', req.body.birthdate);
  data.append('weight', req.body.weight);
  const result = await addCat(data, req.session.token);
  if (result) {
    res.redirect('./');
  } else {
    res.render('add-cat', { title: 'Add cat' });
  }
});

app.get('/add-cat', checkLogin, async (req, res) => {
  res.render('add-cat', { title: 'Add cat' });
});

app.get('/modify-user', checkLogin, async (req, res) => {
  res.render('add-cat', { title: 'Add cat' });
});

app.get('/edit/:catId', checkLogin, async (req, res) => {
  const cat = await getCat(req.session.token, req.params.catId);
  const users = await getUsers(req.session.token);
  res.render('edit-cat', { title: 'Add cat', cat, users });
});

app.get('/delete/:catId', checkLogin, async (req, res) => {
  res.render('add-cat', { title: 'Add cat' });
});

app.get('/', checkLogin, async (req, res) => {
  const cats = await getCats(req.session.token);
  console.log('cats', cats);
  res.render('front', { title: 'Front', cats, user: req.session.user });
});
