import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback,
} from "passport-google-oauth20";
import { UserModel, UserDocument } from "../models/userModel"; // Assuming you have UserDocument type
import dotenv from "dotenv";
dotenv.config();

// GOOGLE OAUTH FLOW WITH PASSPORT:
// INITIALLY:
// 1. /auth/google Route (The user logs in to their Google account and grants permission to your application.)
// 2. /auth/google/callback Route (called after user logs in)
// 3. Passport's Google strategy callback is executed. (Passport receives the user's profile information from callback.)
// 4. done(null, user) is called to signal successful authentication.
// 5. passport.serializeUser() (call done(null, id) to store the user ID in the session)
// 6. Session Creation (if not already exists)
// 7. req.login() (Implicit): (done by passport internally) -> establishes the user's session.
// 8. Redirection (Successful Login) from google callback

// SUBSEQUENT REQUESTS
// 1. The browser sends the connect.sid cookie with each request.
// 2. passport.session() Middleware: (app.use(passport.session()) is called on each subsequent request. Passport reads the user's ID from the session.)
// 3. passport.deserializeUser() -> You retrieve the user's information from the database based on the ID.
// 4. requireAuthenticated middleware calls req.isAuthenticated().

// LOGOUT
// 1. passport clears session data (Added clear cookie and session destroy)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (
      // handles authentication process after Google redirects back to application
      _accessToken: string,
      _refreshToken: string,
      profile: GoogleProfile, // user's profile information
      done: VerifyCallback //type of done. SIGNALS COMPLETION of authentication process
    ) => {
      try {
        // find User with googleId
        let user: UserDocument | null = await UserModel.findOne({
          googleId: profile.id,
        });

        if (!user) {
          // if user doesnt exist, create user
          user = new UserModel({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value || null,
          });
          await user.save();
        }

        return done(null, user); // successful authentication
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// serialize userID into session
passport.serializeUser((user: any, done) => {
  // determines what data to store in the session
  //   console.log("serializeUser called with id:", user.id);
  done(null, user.id);
});

// deserialize user by id from session
// Retrieves the user object from the database based on the id stored in the session.
// This function is called on every subsequent request to your server to identify the authenticated user.
passport.deserializeUser(async (id, done) => {
  //   console.log("deserializeUser called with id:", id);
  try {
    const user = await UserModel.findById(id);
    // console.log("User found:", user);
    if (user) {
      done(null, user); // Pass the user if found
    } else {
      done(null, false); // Pass false if no user found
    }
  } catch (error) {
    console.error("Error in deserializeUser:", error);
    done(error, null);
  }
});
