const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  getAllBooks
    .then((books) => {
      return res.send(JSON.stringify(books, null, 4));
    })
    .catch((err) => {
      return res.status(500).json({ error: "failed to fetch books" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = parseInt(req.params.isbn);


  // for task 11
  // getBookByISBN(isbn)
  //   .then((book) => {
  //     return res.send(JSON.stringify(book, null, 4));
  //   })
  //   .catch((err) => {
  //     return res.status(500).json({ error: err });
  //   });

  return res.send(JSON.stringify(books[isbn], null, 4));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const booksByAuthor = {};
  for (const key in books) {
    if (books[key].author === req.params.author) {
      booksByAuthor[key] = books[key];
    }
  }
  if (Object.keys(booksByAuthor).length > 0) {
    return res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res
      .status(403)
      .json({ message: "book not found by author " + req.params.author });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const booksByTitle = {};
  for (const key in books) {
    if (books[key].title === req.params.title) {
      booksByTitle[key] = books[key];
    }
  }
  if (Object.keys(booksByTitle).length > 0) {
    return res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res
      .status(403)
      .json({ message: "book not found by the Title " + req.params.title });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

// Using Promise callbacks  function

// Task 10

const getAllBooks = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(books);
  }, 1000);
});
// Task 11

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (!book) {
        reject("Book not found");
      }
      resolve(book);
    }, 1000);
  });
}

// task 12
function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = [];
      for (const key in books) {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      }
      if (booksByAuthor.length === 0) {
        reject("Book not found");
      }
      resolve(booksByAuthor);
    }, 3000);
  });
}

// Task 13
function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for (const key in books) {
        if (books[key].title === title) {
          resolve(books[key]);
        }
      }
      reject("Book not found");
    }, 3000);
  });
}

module.exports.general = public_users;
