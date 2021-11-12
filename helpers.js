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
const getUserByEmail = (users, email) => {   
    for (let key in users) {   
        if (users[key].email === email) {   
              return users[key];     
            } 
          } 
    return false;
};
module.exports = getUserByEmail;