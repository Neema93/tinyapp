const express = require("express");
const app = express();
const PORT = 8014; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
// get data from in helpers.js
const { checkUrlForUser, generateRandomString, authenticateUser, users, urlDatabase} = require('./helpers.js');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
// main get request for transfer data.
app.get("/", (req, res) => {
  res.render("logindisplay");
});
// hello get for greeting every one
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});
// get urls store database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// page open when we are login
app.get("/urls", (req, res) => {
  const userId = req.session.userId;
  console.log(req.session.userId);
  if (!userId) {
    return res.status(401).send("please login first<a href='/login'>try agin</a>");
  }
  const templateVars = { urls:checkUrlForUser(req.session.userId) ,
    userId: req.session.userId,
    urls:urlDatabase};
  res.render("urls_index", templateVars);
});
// create new urls
app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("please login first<a href='/login'>try agin</a>");
  }
  let templateVars = { userId:userId};
  res.render("urls_new", templateVars);
});

// match sort url ,long url put in templatevars
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("please login first<a href='/login'>try agin</a>");
  }
  console.log(urlDatabase);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  let templateVars = { shortURL:shortURL, longURL:longURL, userId:req.session.userId};
  res.render("urls_show", templateVars);
});
//set data
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
//  match sort url to long url
app.get("/u/:shortURL", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("please login first<a href='/login'>try agin</a>");
  }
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});
//  match sort url to long url
app.post("/urls", (req, res) => {
  const userId = req.session.userId;
  const longURL = req.body.longURL;
  if (!userId) {
    return res.status(401).send("please login first<a href='/login'>try agin</a>");
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { userId,longURL};
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});
// delete urls working
app.post('/urls/:shortURL/delete', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("please login first<a href='/login'>try agin</a>");
  }
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});
// fetch shorturls
app.get('/urls/:id', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("please login first<a href='/login'>try agin</a>");
  }
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(`/urls/${shortURL}`);
});
//edit urls
app.post('/urls/:id/edit',(req, res) =>{
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("please login first<a href='/login'>try agin</a>");
  }
  //console.log('req.body', req.body)
  const id = req.params.id;
  console.log("hii",id);
  const newURL = req.body.longURL;
  urlDatabase[id].longURL = newURL;
  res.redirect('/urls');
});

app.post('/login',(req, res) =>{
  const email = req.body.email;
  const password = req.body.password;
  const result = authenticateUser(users,email, password);
  if (result) {
    req.session.userId = result.id;
    res.redirect('/urls');
  } else {
    return res.status(403).send("Username and password does not match");
  }
   
});
// login get
app.get(`/login`,(req, res) => {
  const templateVars = {userId:req.session.userId};
  res.render('login', templateVars);
});
// logout post
app.post('/logout',(req,res) => {
  req.session = null;
  // res.clearCookie('user_id');
  res.redirect('/');
});
// register post
app.post(`/register`,(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  for (let key in users) {
    if (users[key].email === email) {
      return res.send(`${users[key].email}this email already exit`);
    }
  }
  if (email === "" || password === "") {
    return res.status(400).send("Username and password bed");
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      const id = email;
      users[id] = {
        id,
        email,
        password: hash
      };
      req.session.userId = id;
      res.redirect('/urls');
    });
  });
});
//get register
app.get(`/register`,(req, res) =>{
  const templateVars = {userId:req.session.userId};
  res.render('register', templateVars);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});