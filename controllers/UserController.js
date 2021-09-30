const express = require('express');
var _ = require('lodash');
const cookieParser = require('cookie-parser')
const path = require("path");
const helmet = require("helmet");
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
var UserModel = require('../models/UserModel')

app.use(express.static(path.join(__dirname, "..", "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
    // check if user is logged in, by checking cookie
    let username = req.cookies.email;
  
    // render the home page
    console.log("__dirname",__dirname)
    return res.render(__dirname + "/views/home.ejs", {
      username,
    });
  });

  app.get("/login", (req, res) => {
    // check if there is a msg query
    let bad_auth = req.query.msg ? true : false;
  
    // if there exists, send the error.
    if (bad_auth) {
      return res.render("login", {
        error: "Invalid username or password",
      });
    } else {
      // else just render the login
      return res.render("login");
    }
  });
  
  app.get("/welcome", (req, res) => {
    // get the username
    let username = req.cookies.username;
  
    // render welcome page
    return res.render("welcome", {
      username,
    });
  });
  
  app.post("/process_login", (req, res) => {
    // get the data
    let { username, password } = req.body;
     //test data
    let userdetails = {
      username: "bhagyashri",
      password: "123456",
    };
    if (
      username === userdetails["username"] &&
      password === userdetails["password"]
    ) {
      // saving the data to the cookies
      res.cookie("username", username);
      // redirect
      return res.redirect("/welcome");
    } else {
      // redirect with a fail msg
      return res.redirect("/login?msg=fail");
    }
  });
  
  app.get("/logout", (req, res) => {
    // clear the cookie
    res.clearCookie("username");
    // redirect to login
    return res.redirect("/login");
  });
// Signup
app.post("/signup", async (req, res) => {
    try {
        var data = await UserModel.signUp(req.body)
        if (data.value) {
            res.status(200).json(data.data)
        } else {
            res.status(500).json(data)
        }
    } catch (error) {
        res.status(500).send(error)
    }
}),
//Login
app.post("/userlogin", async (req, res) => {
    try {
        let outputData = await UserModel.login(req.body)
        if (outputData && outputData.value) {
          
            res.status(200).json(outputData.data)
        } else {
            res.status(500).json(outputData)
        }
    } catch (error) {
        console.log("inside err", error)
        res.status(500).send(error)
    }
})
  

module.exports = app;