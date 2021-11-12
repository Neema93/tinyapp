const express = require("express");
const app = express();
const PORT = 8004; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b6UTxQ": {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
},
"i3BoGr": {
    longURL: "https://www.google.ca",
    userID: "user2RandomID"
}
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

function generateRandomString() {
  //create random string
  let random_string = Math.random().toString(36).substring(0, 6);   
  return random_string;
}

const checkUrlForUser = (user_id) =>{
  const newObj = {};
  for(const key in urlDatabase){
    console.log(key)
    if(urlDatabase[key].userID === user_id){
      newObj[key] = urlDatabase[key].longURL;
    }
  }
  return newObj;
}
//This function written by Rohit
const findUserByEmail = (users, email) => {   
  for (let key in users) {   
      if (users[key].email === email) {   
            return users[key];     
          } 
        } 
    return false;
 };

 const authenticateUser = (users, email, password) => {    
   const userFound = findUserByEmail(users, email); 
     if (userFound && bcrypt.compareSync(password, userFound.password)) { 
           return userFound;
      }  
      return false;
   }
// end of the function.

app.get("/", (req, res) => {
  res.render("logindisplay");
});
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  console.log(req.cookies["user_id"]);
  const templateVars = { urls:checkUrlForUser(req.cookies["user_id"]) ,
    user_id: req.cookies["user_id"]};
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies.user_id;
  let templateVars = { user_id:user_id};
    res.render("urls_new", templateVars);
  });
app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.cookies.user_id;
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  let templateVars = { shortURL:shortURL, longURL:longURL, user_id:user_id};
  res.render("urls_show", templateVars);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
app.get("/u/:shortURL", (req, res) => {
  //console.log(req);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
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
  //console.log("hello",shortURL);
  const longURL = urlDatabase[shortURL].longURL;
  //console.log(longURL);
  res.redirect(`/urls/${shortURL}`);
});
app.post('/urls/:id/edit',(req, res) =>{
  console.log('req.body', req.body)
  const id = req.params.id;
  //console.log("hii",id);
  const newURL = req.body.longURL;
  urlDatabase[id] = newURL;
  res.redirect('/urls');
});

app.post('/login',(req, res) =>{
    console.log(req.body);
    console.log(users);
    const email = req.body.email;
    const password = req.body.password;
    const result = authenticateUser(users,email, password);
    console.log(result);
    //const password = "purple-monkey-dinosaur"; // found in the req.params object
    //const hashedPassword = bcrypt.hashSync(password, 10);
   
       if (result){
         res.cookie("user_id", result.id);
         res.redirect('/urls');
       } else {
         return res.status(403).send("Username and password does not match");
       }
   
});
app.get(`/login`,(req, res) => {

  const templateVars = {user_id:req.cookies.user_id}
  res.render('login', templateVars);
})
app.post('/logout',(req,res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});
app.post(`/register`,(req,res) => {
  const id = generateRandomString();
  res.cookie("user_id",id)
  const email = req.body.email;
  for(let key in users){
    if(users[key].email === email){
      return res.send(`${users[key].email}this email already exit`);
    }
  }
  const { email1, password1 } = req.body;
  
  if (email1 === "" || password1 === ""){
    return res.status(400).send("Username and password bed");
  } else {
    res.cookie("user_id", id);
    //res.redirect('/');
  }
  const password = req.body.password;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      const id = Math.floor(Math.random() * 1000) + 1;
      users[id] = {
        id, 
        email,
        password: hash
      }
      console.log('users', users);

      res.redirect('/')
    })
  })
  //users[id] = {id:id, email:email, password:password }
 
})
app.get(`/register`,(req, res) =>{
  const templateVars = {user_id:req.cookies.user_id}
  res.render('register', templateVars);
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//console.log("hello");