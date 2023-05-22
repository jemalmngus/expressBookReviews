const e = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

//Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};
const authenticatedUserSession = (req, res, next) => {
  if (req.session.authorization) {
    //get the authorization object stored in the session
    token = req.session.authorization["accessToken"]; //retrieve the token from authorization object
    jwt.verify(token, "access", (err, user) => {
      //Use JWT to verify token
      if (!err) {
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
};
//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const next = () => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
      let review = req.query.review;

      if (review) {
        book["reviews"][username] = review;
        books[isbn] = book;
      }
      res.send(
        `The review for the book with ISBN  ${isbn} has been added/updated.`
      );
    } else {
      res.send("Unable to find this ISBN");
    }
  };
  authenticatedUserSession(req, res, next);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const next = () => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
      delete book.reviews[username]
      return res.status(200).send("Review successfully deleted")
    } else {
      res.send("Unable to find this ISBN");
    }
  };
  authenticatedUserSession(req, res, next);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
