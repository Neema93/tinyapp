const express = require("express");
const app = express();
const PORT = 8028; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",

  };
function generateRandomString() {
  //create random string
  let random_string = Math.random().toString(36).substring(0, 6);   
  return random_string;
}
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls", (req, res) => {
  console.log(req.cookies);
  const templateVars = { urls: urlDatabase,
    username: req.cookies["username"] };
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {
  const username = req.cookies.username;
  let templateVars = { username:username};
    res.render("urls_new", templateVars);
  });
app.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies.username;
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  let templateVars = { shortURL:shortURL, longURL:longURL, username:username};
  res.render("urls_show", templateVars);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
app.get("/u/:shortURL", (req, res) => {
  //console.log(req);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  //console.log(generateRandomString());
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  //console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});
app.get('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  console.log("hello",shortURL);
  const longURL = urlDatabase[shortURL];
  //console.log(longURL);
  res.redirect(`/urls/${shortURL}`);
});
app.post('/urls/:id/edit',(req, res) =>{
  console.log('req.body', req.body)
  const id = req.params.id;
  console.log("hii",id);
  const newURL = req.body.longURL;
  urlDatabase[id] = newURL;
  res.redirect('/urls');
});
app.post('/login',(req, res) =>{
console.log(req.body);
  res.cookie("username",req.body.username);
  res.redirect('/urls');
});
app.post('/logout',(req,res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//console.log("hello");