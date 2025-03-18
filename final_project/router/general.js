const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//Task10
const getBooks = () => 
  {
    return new Promise((resolve, reject) => 
    {
      resolve(books);
    })
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username || !password)
  {
    res.status(400).json({message: "Credentials must be entered"})

  }
  if(users.find((user)=>
  user.username === username
  ))
  {
    return res.status(409).json({message: "Username already exists"})
  }

  users.push({username, password});

  return res.status(300).json({message: "User yet to be registered"});
});



// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try{
    const bookList = await getBooks();
    res.json(bookList);
  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list"});
  }
  
});

const getByISBN = (isbn) => 
{
  return new Promise((resolve, reject) =>
  {
    let isbnNum = parseInt(isbn);
    if(books[isbnNum])
    {
      resolve(books[isbnNum]);
    }
    else{
      reject({status: 404, message: `ISBN ${isbn} not found`});
    }
  })
}

//Task 2 
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  getByISBN(req.params.isbn)
  .then(
    result => res.send(result),
    error => res.status(error.status).json({message: error.message})
  );
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author Task 3
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  getBooks()
  .then((bookEntries)=> Object.values(bookEntries))
  .then((books) => books.filter((book)=> book.author === author))
  .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title Task 4 and 12
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book)=> book.title===title))
  .then((filteredBooks) => res.send(filteredBooks));
});


//  Get book review Task 5 and 13
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getByISBN(req.params.isbn)
  .then(
    result => res.send(result.reviews),
    error => error.status(error.status)
  )
});

module.exports.general = public_users;
