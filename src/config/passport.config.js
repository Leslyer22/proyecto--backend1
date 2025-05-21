import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import {userModel} from "../models/user.model.js";
import { cartModel } from "../models/cart.model.js";
import { createHash, validatePass } from "../utils/hash.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { sendEmail } from "../mailer.js";

import { userService } from "../services/userService.js";
import { cartService } from "../services/cartService.js";
import UserDTO from "../dto/userDto.js"


const LocalStrategy = local.Strategy;

const cookieExtractor = req => req?.cookies?.token;

 export const initializePassport = () => {

// 🎯 Estrategia para REGISTER
passport.use("register", new LocalStrategy(
  { usernameField: "email", passReqToCallback: true },
  async (req, email, password, done) => {
    const { first_name, last_name, age, role } = req.body;

    try {
      //const user = await userModel.findOne({ email });

       const user = await userService.findByEmail(email);

      if (user) return done(null, false, { message: "User already exists" });

      //const cart = await cartModel.create({ products: [] });
       const cart = await cartService.createCart();

      /*const newUser = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        //al crear el user seteamos el cart
        cartId: cart._id
      }); */

        const newUser = await userService.createUser({
          first_name,
          last_name,
          email,
          age,
          password: createHash(password),
          cartId: cart._id,
          role
        });

      // 👇 Manda el email de confirmación después del registro
        try {

          await sendEmail(email, first_name);
          console.log("📨 Email enviado",email);
        } catch (emailErr) {
          console.error("❌ Error al enviar el email:", emailErr);
        }

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
      //const user = await userModel.findOne({ email });

         const user = await userService.findByEmail(email);

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
  secretOrKey: process.env.PASS_TOKEN
}, async (payload, done) => {
  try {

      const userDTO = new UserDTO(payload);  

    return done(null, userDTO);
  } catch (err) {
    return done(err);
  }
}));

 };




