const passport = require("passport");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
// % funcionalidad de nodejs para generar tokens
const Op = require("sequelize").Op;
const enviarEmail = require("../handlers/email");

const Usuarios = require("../model/Usuarios");

exports.autenticarUsuario = passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/iniciar-sesion",
	failureFlash: true,
	badRequestMessage: "Ambos Campos son obligatorios",
});

exports.usuarioAutenticado = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.redirect("/iniciar-sesion");
};

exports.cerrarSesion = (req, res, next) => {
	req.logOut();
	res.redirect("/iniciar-sesion");
};

// * genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {

	try {
		const usuario = await Usuarios.findOne({ where: { email: req.body.email } });

		usuario.token = crypto.randomBytes(20).toString("hex");
		// % funcion que genera un token aleatorio
		usuario.expiracion = Date.now() + 3600000;

		await usuario.save();

		// * url de reset
		const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
		
		// * envia el correo con el token
		await enviarEmail.enviar({
			usuario,
			subject: "Password Reset",
			resetUrl,
			archivo: "reestablecer-password"
		})
		req.flash("correcto","se envio un mensaje a tu correo")
		res.redirect("/iniciar-sesion")
	} catch (error) {
		console.log(error);
		req.flash("error", "No existe esa cuenta");
		res.redirect("/reestablecer");
	}
};

exports.enviarTokenForm = async (req, res) => {
	const usuario = await Usuarios.findOne({
		where: {
			token: req.params.token,
		},
	});

	if (!usuario) {
		req.flash("error", "No valido");
		res.redirect("/reestablecer");
	}

	// * formulario para generar el password
	res.render("resetPassword", {
		nombrePagina: "Reestablecer Contraseña",
	});
};

exports.actualizarPassword = async (req, res) => {
    // % verifica el token valido pero tambien la fecha de expiracion
	const usuario = await Usuarios.findOne({
        where: { 
            token: req.params.token,
            expiracion:{
                [Op.gte] : Date.now()
            }
        },
    });
    
    // * verificamos si el usuario existe

    if (!usuario) {
        req.flash("error","Tiempo expirado")
        res.redirect("/reestablecer");
    }

    usuario.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10))
    // % hashear el password
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();

    req.flash("correcto","Tu password se ha modificado correctamente");
    res.redirect("/iniciar-sesion")

};
