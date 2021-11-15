const bcrypt = require('bcryptjs');
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
  };
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
const getUserByEmail = (users, email) => {   
    for (let key in users) {   
        if (users[key].email === email) {   
              return users[key];     
            } 
          } 
    return false;
};

// check password
const authenticateUser = (users, email, password) => {    
  const userFound = getUserByEmail(users, email); 
  console.log("check email",userFound)
  if (userFound && bcrypt.compareSync(password, userFound.password)) { 
    return userFound;
  }  
  return false;
};
//create create random function
function generateRandomString() {
  //create random string
  let random_string = Math.random().toString(36).substring(0, 6);   
  return random_string;
};
// create url check function
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
module.exports = { checkUrlForUser,generateRandomString, authenticateUser, users, urlDatabase};