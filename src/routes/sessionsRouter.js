import {Router} from "express";
import {initializePassport} from "../config/passport.config.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import {auth} from "../middleware/auth.js"

const router = Router();

const JWT =process.env.PASS_TOKEN
//  REGISTER usando estrategia "register"

router.post("/register", passport.authenticate("register", { session: false }), (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true }).json({
    status: "success",
    message: "User registered",
    user: {
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    }
  });
});

//  LOGIN usando estrategia "login"

router.post("/login", passport.authenticate("login", { session: false }), (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true }).json({
    status: "success",
    message: "Login successful",
    user: {
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    }
  });
});



router.get("/current",auth, (req, res) => {
  const user = req.user;
  res.json({
    status: "success",
    user
  });
});

export default router;
