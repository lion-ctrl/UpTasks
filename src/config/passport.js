const passport = require("passport");
const LocalStrategy = require("passport-local");

// * Referencia al modelo que se va a aunthenticar
const Usuarios = require("../model/Usuarios");

// * local strategy
passport.use(
	new LocalStrategy(
		// % por defecto passport espera un usuario y password
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				const usuario = await Usuarios.findOne({
					where: {
						email,
						activo: 1,
					},
				});
				// % verificando el usuario

				if (!usuario.verificarPassword(password)) {
					return done(null, false, { message: "Password incorrecto" });
				}
				done(null, usuario);
			} catch (error) {
				done(null, false, { message: "Esa cuenta no existe" });
				// % cuando no existe el usuario
			}
		}
	)
);

// * serializar y deserializar
passport.serializeUser((usuario, callback) => {
	callback(null, usuario);
});

passport.deserializeUser((usuario, callback) => {
	callback(null, usuario);
});

module.exports = passport;
