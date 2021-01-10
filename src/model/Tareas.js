const Sequelize = require("sequelize");
const db = require("../config/db");

const Proyectos = require("./Proyectos");

const Tareas = db.define("tareas", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});
Tareas.belongsTo(Proyectos);
// % enlazando las 2 tablas a travez de la llave foranea
// Proyectos.hasMany(Tareas);
// % se puede enlazar de esta manera pero el comando iria en el modelo de proyectos

module.exports = Tareas;
