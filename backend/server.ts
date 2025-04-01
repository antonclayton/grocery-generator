import dotenv from "dotenv";
dotenv.config(); // allow access to dotenv vars

// variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore = require("connect-mongo");
import passport from "passport";
import session from "express-session";

// route imports

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // days hours minutes seconds milli
    },
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // MongoDB connection string
      ttl: 14 * 24 * 60 * 60, // Session TTL (14 days)
      autoRemove: "native", // removes expired sessions automatically.
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// request logging middleware
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// routes

// basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// connect to DB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("connected to DB and listening on the port " + PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error: " + err);
  });
