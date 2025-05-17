import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import {userModel} from "../models/user.model.js";
import { cartModel } from "../models/cart.model.js";
import { createHash, validatePass } from "../utils/hash.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";


const LocalStrategy = local.Strategy;

const cookieExtractor = req => req?.cookies?.token;

 export const initializePassport = () => {

// 🎯 Estrategia para REGISTER
passport.use("register", new LocalStrategy(
  { usernameField: "email", passReqToCallback: true },
  async (req, email, password, done) => {
    const { first_name, last_name, age } = req.body;

    try {
      const user = await userModel.findOne({ email });
      if (user) return done(null, false, { message: "User already exists" });

      const cart = await cartModel.create({ products: [] });

      const newUser = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        //al crear el user seteamos el cart
        cartId: cart._id
      });

      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }
));

// 🎯 Estrategia para LOGIN
passport.use("login", new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) return done(null, false, { message: "User not found" });   

      const isValid = validatePass(password, user.password);
      if (!isValid) return done(null, false, { message: "Invalid password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// 🎯 Estrategia JWT para /current
passport.use("jwt", new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: "jwtSecretKey"
}, async (payload, done) => {
  try {
    const user = await userModel.findById(payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

 };




