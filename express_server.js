const express = require("express");
const app = express();
const PORT = 8021; // default port 8080
const bodyParser = require("body-parser");
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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL:` http://localhost:8080/urls/b2xVn2` };
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
    console.log(longURL);
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  //console.log(generateRandomString());
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//console.log("hello");