const router = require("express").Router();
const { body } = require("express-validator");

// ? controladores
const proyectosController = require("../controllers/proyectosController");
const tareasController = require("../controllers/tareasController");
const usuariosController = require("../controllers/usuariosControllers");
const authController = require("../controllers/authController");

router
	.get(
		"/",
		authController.usuarioAutenticado,
		proyectosController.proyectos,
		proyectosController.proyectosHome
	)
	.get(
		"/nuevo-proyecto",
		authController.usuarioAutenticado,
		proyectosController.proyectos,
		proyectosController.formularioProyecto
	)
	.post(
		"/nuevo-proyecto",
		authController.usuarioAutenticado,
		body("nombre").not().isEmpty().trim().escape(),
		// % express-validator: se pasa el nombre del campo que se quiere validar aplicando las siguientes funciones dependiendo de lo que se quiere validar
		proyectosController.nuevoProyecto
	)
	.get(
		"/proyectos/:url",
		authController.usuarioAutenticado,
		proyectosController.proyectos,
		proyectosController.obtenerProyecto
	)
	// * editar proyecto
	.get(
		"/proyecto/editar/:id",
		authController.usuarioAutenticado,
		proyectosController.proyectos,
		proyectosController.formularioEditar
	)
	.post(
		"/nuevo-proyecto/:id",
		authController.usuarioAutenticado,
		body("nombre").not().isEmpty().trim().escape(),
		proyectosController.actualizarProyecto
	)
	// * eliminar proyecto
	.delete(
		"/proyectos/:url",
		authController.usuarioAutenticado,
		proyectosController.eliminarProyecto
	)
	// * tareas
	.post(
		"/proyectos/:url",
		authController.usuarioAutenticado,
		tareasController.agregarTarea
	)
	// * actualizar estado Tarea
	.patch(
		"/tareas/:id",
		authController.usuarioAutenticado,
		tareasController.estado
	)
	// * eliminar tarea
	.delete(
		"/tareas/:id",
		authController.usuarioAutenticado,
		tareasController.eliminar
	)
	// * crear Cuenta
	.get("/crear-cuenta", usuariosController.formCrearCuenta)
	.post("/crear-cuenta", usuariosController.crearCuenta)
	// * iniciar sesion
	.get("/iniciar-sesion", usuariosController.formIniciarSesion)
	.post("/iniciar-sesion", authController.autenticarUsuario)
	// * cerrar sesion
	.get("/cerrar-sesion",authController.cerrarSesion)
	// * reestablecer contraseña
	.get("/reestablecer",usuariosController.formReestablecer)
	.post("/reestablecer",authController.enviarToken)
	.get("/reestablecer/:token",authController.enviarTokenForm)
	.post("/reestablecer/:token",authController.actualizarPassword)
	// * activar cuenta
	.get("/confirmar/:correo",usuariosController.confirmarCuenta)


module.exports = router;
