const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const sameusername = users.filter((user)=> user.username === username);
return sameusername.length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const matchlst = users.filter((user)=> user.username === username && user.password === password);
return matchlst.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let token = jwt.sign({data: password}, "access", {expiresIn: 60*60});
    req.session.authorization = {
        accessToken: token,
        username
    }
    console.log('session:', req.session);
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log('session:', req.session);
  const auth_data = req.session.authorization;
  const username = auth_data.username;
  const isbn = req.params.isbn;
  const review = (req.query.review || "").toString().trim();
  
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required in the URL" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query param ?review=..." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
  
  book.reviews[username] = review;
  res.send("review "+ review + " is added to book " + book.title + " by user " + username);
  

});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization.username;
    const book = books[isbn];
    delete book.reviews[user];
    res.send("after deleting for user "+ user + " and book at isbn " + isbn);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
