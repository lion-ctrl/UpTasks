const Proyectos = require("../model/Proyectos");
const Tareas = require("../model/Tareas");

exports.agregarTarea = async (req, res) => {
	const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

	const tarea = {
		tarea: req.body.tarea,
		estado: 0,
		proyectoId: proyecto.id,
	};
	await Tareas.create(tarea);

	res.redirect(`/proyectos/${req.params.url}`);
};

exports.estado = async (req, res) => {
	const tarea = await Tareas.findOne({ where: { id: req.params.id } });

	tarea.estado == 0 ? (tarea.estado = 1) : (tarea.estado = 0);

	const resultado = await tarea.save();

	if (!resultado) res.redirect("/");

	res.status(200).send("Actualizado");
};

exports.eliminar = async (req,res) => {
	const resultado = await Tareas.destroy({where:{id:req.params.id}})

	if (!resultado) res.redirect("/");

	res.status(200).send("Tarea Eliminada Correctamente");
}
