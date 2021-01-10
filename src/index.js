const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
// const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: "variables.env" });

const passport = require("./config/passport");

const app = express();

// ? helpers
const helpers = require("./helpers");

// ? conexion db
const db = require("./config/db");

require("./model/Proyectos");
require("./model/Tareas");
require("./model/Usuarios");
// % IMPORTANTE: al momento de solo requerir el modelo ya crea la tabla en la db por si sola sin necesidad de crearla manualmente

db.sync()
	// % sync(): funcion que se encarga de crear las tablas en la db sin necesidad de crearlas manualmente
	.then(() => console.log("Conectado a la db"))
	.catch((err) => console.error("Error al conectar a la db"));

// ? configuracion
app.set("port",process.env.PORT || 3000)
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(cookieParser());

// ? sessiones
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
	})
);

// ? flash messages
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// ? variables globales
app.use((req, res, next) => {
	res.locals.usuario = {...req.user} || null;
	res.locals.var_dump = helpers.vardump;
	res.locals.mensajes = req.flash();
	next();
});

// ? archivos estaticos
app.use(express.static(path.join(__dirname, "/public")));

app.use(require("./routes/index.routes"));

const host = process.env.host || "0.0.0.0";
app.listen(app.get("port"),host, () => {
	console.log("server on port", app.get("port"));
});
