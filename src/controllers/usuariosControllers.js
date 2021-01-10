const Usuarios = require("../model/Usuarios");
const enviarEmail = require("../handlers/email");

exports.formCrearCuenta = (req, res) => {
	res.render("crearCuenta", {
		nombrePagina: "Crear Cuenta en Uptask",
	});
};

exports.formIniciarSesion = (req, res) => {
	// console.log(res.locals.mensajes);
	// % revisar los mensajes de error emitidos desde passport, al activar failureFlash: true,
	const { error } = res.locals.mensajes;
	res.render("iniciarSesion", {
		nombrePagina: "Iniciar Sesion en Uptask",
		error,
	});
};

exports.crearCuenta = async (req, res) => {
	// * leer los datos
	const { email, password } = req.body;
	try {
		// * crear el usuario
		await Usuarios.create({
			email,
			password,
		});

		// * crear una URL para confirmar
		const confirmarURL = `http://${req.headers.host}/confirmar/${email}`

		// * crear el objeto de usuario
		const usuario = {
			email
		}

		// * enviar email
		await enviarEmail.enviar({
			usuario,
			subject: "Confirmar Cuenta UpTask",
			confirmarURL,
			archivo: "confirmar-cuenta"
		})

		// * redirigir al usuario
		req.flash("correcto","Enviamos un correo, confirma tu cuenta");
		res.redirect("/iniciar-sesion");
	} catch (error) {
		// % mensajes de error emitido desde sequelize enviados desde el modelo
		req.flash(
			"error",
			error.errors.map((error) => error.message)
		);
		res.render("crearCuenta", {
			nombrePagina: "Crear Cuenta de UpTask",
			mensajes: req.flash(),
			email,
			password,
		});
	}
};

exports.formReestablecer = (req,res) => {
	res.render("reestablecer",{
		nombrePagina: "Reestablecer tu Contraseña"
	})
}

exports.confirmarCuenta = async (req,res) => {
	const usuario = await Usuarios.findOne({
		where: {
			email: req.params.correo
		}
	})

	if (!usuario) {
		req.flash("error","No valido");
		res.redirect("/crear-cuenta");
	}

	usuario.activo = 1;
	await usuario.save();

	req.flash("correcto","Cuenta Confirmada");
	res.redirect("/iniciar-sesion");
}
