import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback,
} from "passport-google-oauth20";
import { UserModel, UserDocument } from "../models/userModel"; // Assuming you have UserDocument type
import dotenv from "dotenv";
dotenv.config();

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
  done(null, user.id);
});

// deserialize user by id from session
// Retrieves the user object from the database based on the id stored in the session.
// This function is called on every subsequent request to your server to identify the authenticated user.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user || undefined);
  } catch (error) {
    done(error, null);
  }
});
