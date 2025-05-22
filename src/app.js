import dotenv from "dotenv";
import express from "express";
import open from "open"; //abrir el navegador automaticamente
import mongoose from "mongoose";
import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import {initializePassport} from "./config/passport.config.js";
import {sendEmail} from "./mailer.js"

import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import viewsRouter from "./routes/viewsRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views")); 


// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));


dotenv.config();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

initializePassport();

const PORT =process.env.PORT ;
const MONGO_URL =process.env.DB_URL;
const DB_NAME =process.env.DB_NAME;

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URL)
    console.log("Connected to MongoDB");

  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1); //cerra la aplicación
  }
};
connectMongo();

//router (endpoints)

app.use("/api/sessions",sessionsRouter);

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);

app.use("/", viewsRouter);


 /*lo comento pues le agrego al server.js el servidor con websockets a parte*/
 //para escuchar el app.js
 
/*app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
}); */

//open("httplocalhost:{PORT}");
 export default app