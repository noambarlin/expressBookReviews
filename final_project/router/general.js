const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  } else {
    return res.status(404).json({message: "Unable to register user."});
  }
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null,4));
});

public_users.get('/', (req, res) => {
    new Promise((resolve) => resolve(books))
      .then((data) => res.status(200).json(data))
      .catch((err) =>
        res.status(500).json({ message: 'Error fetching books', error: err?.message })
      );
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });


 public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject(new Error("book not found"));
        }
    })
    .then((book)=> res.status(200).json(book))
    .catch((err)=> res.status(404).json({message: err.message}));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const result = Object.values(books).filter((book) => book.author === author);
  res.send(result);
});


public_users.get('/author/:author', (req,res)=> {
    const author = req.params.author;
    new Promise((resolve, reject)=>{
        const matching = Object.values(books).filter((book) => book.author === author);
        if (matching.length > 0) {
            resolve(matching);
        } else {
            reject(new Error("no books found for this author"));
        }
    })
    .then((data)=> res.status(200).json(data))
    .catch((err)=> res.status(404).json({message: err.message}));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const result = Object.values(books).filter((book) => book.title === title);
  res.send(result);
});

public_users.get('title/:title', (req,res)=> {
    const title = req.params.title;
    new Promise((resolve, reject)=> {
        const matching = Object.values(books).filter((book)=> book.title === title);
        if (matching.length > 0) {
            resolve(matching);
        } else {
            reject(new Error("no cooks are found for this title"));
        }
    })
    .then((data)=> res.status(200).json(data))
    .catch((err)=> res.status(404).json({message: err.message}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(book.reviews);
});

module.exports.general = public_users;
