const Proyectos = require("../model/Proyectos");
const Tareas = require("../model/Tareas");
// const slug = require("slug");

// ? middlewares
exports.proyectos = async (req, res, next) => {
	// console.log(res.locals.usuario.id);
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });
	res.locals.proyectos = proyectos;
	next();
};
// % todos los proyectos pasados a todas las vistas

exports.proyectosHome = (req, res) => {
	res.render("index", {
		nombrePagina: "Proyectos",
	});
};

exports.formularioProyecto = (req, res) => {
	res.render("nuevoProyecto", { nombrePagina: "Nuevo Proyecto" });
};

exports.nuevoProyecto = async (req, res) => {
	const { nombre } = req.body;

	let errores = [];

	if (!nombre) {
		errores.push({ texto: "Agrega un Nombre al Proyecto" });
	}
	if (errores.length > 0) {
		res.render("nuevoProyecto", {
			nombrePagina: "Nuevo Proyecto",
			errores,
		});
	} else {
		// const url = slug(nombre).toLowerCase();
		// % slug(): funcion que transforma la palabra ingresada como una url
		const usuarioId = res.locals.usuario.id;
		await Proyectos.create({ nombre, usuarioId });
		res.redirect("/");
	}
};

exports.obtenerProyecto = async (req, res) => {
	const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });
	// % consulta sql en sequelize

	if (!proyecto) {
		res.redirect("/");
	}

	// * obtener tareas del proyecto actual
	const tareas = await Tareas.findAll({
		where: { proyectoId: proyecto.id },
		// include: { model: Proyectos },
	});
	// % include: propiedad que incluye el modelo al que se hace referencia con la llave foranea es decir como si fuera un JOIN

	res.render("tareas", {
		nombrePagina: "Tareas del proyecto",
		proyecto,
		tareas,
	});
};

exports.formularioEditar = async (req, res) => {
	const proyecto = await Proyectos.findByPk(req.params.id);
	res.render("nuevoProyecto", {
		nombrePagina: "Editar Proyecto",
		proyecto,
	});
};

exports.actualizarProyecto = async (req, res) => {
	const { nombre } = req.body;

	let errores = [];

	if (!nombre) {
		errores.push({ texto: "Agrega un Nombre al Proyecto" });
	}
	if (errores.length > 0) {
		res.render("nuevoProyecto", {
			nombrePagina: "Nuevo Proyecto",
			errores,
		});
	} else {
		await Proyectos.update({ nombre }, { where: { id: req.params.id } });
		res.redirect("/");
	}
};

exports.eliminarProyecto = async (req, res) => {
	// % req.params: muestra la propiedad como es indicada en la ruta del servidor
	// % req.query: muestra la propiedad como es indicada en la peticion
	const resultado = await Proyectos.destroy({ where: { url: req.params.url } });
	if (!resultado) {
		res.status(400).send("Error");
	}
	res.status(200).send("Proyecto Eliminado Satisfactoriamente");
};
