import dotenv from "dotenv";
dotenv.config(); // allow access to dotenv vars

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import session from "express-session";

// custom middleware imports'
import errorHandler from "./middleware/errorHandler";

// passport configuration
import "./config/passport";

// variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";

// route imports
import authRoutes from "./routes/authRoutes";
import ingredientRoutes from "./routes/ingredientRoutes";
import recipeRoutes from "./routes/recipeRoutes";
import shoppingListRoutes from "./routes/shoppingListRoutes";
import mealPlanRoutes from "./routes/mealPlanRoutes";

// express app
const app = express();

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Your frontend URL
    credentials: true, // THIS IS CRUCIAL - allows cookies to be sent cross-origin
  })
);
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // days hours minutes seconds milli
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // MongoDB connection string
      ttl: 7 * 24 * 60 * 60, // Session TTL (14 days)
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
app.use("/auth", authRoutes); // GOOGLE AUTH
app.use("/api/v1/ingredients", ingredientRoutes);
app.use("/api/v1/recipes", recipeRoutes);
app.use("/api/v1/shopping-lists", shoppingListRoutes);
app.use("/api/v1/meal-plan", mealPlanRoutes);

// error handling middleware
app.use(errorHandler);

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
