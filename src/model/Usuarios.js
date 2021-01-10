const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

const db = require("../config/db");
const Proyectos = require("../model/Proyectos");

const Usuarios = db.define(
	"usuarios",
	{
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: Sequelize.STRING(60),
			allowNull: false,
			validate: {
				isEmail: {
					msg: "Agrega un correo Valido",
				},
				notEmpty: {
					msg: "El Email no puede ir vacio",
				},
			},
			unique: {
				args: true,
				msg: "Usuario ya Registrado",
			},
		},
		password: {
			type: Sequelize.STRING(60),
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "La Contraseña no puede ir vacia",
				},
			},
		},
		activo: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
		},
		// * campos para recuperar contraseña
		token: Sequelize.STRING,
		expiracion: Sequelize.DATE,
	},
	{
		hooks: {
			beforeCreate(usuario) {
				usuario.password = bcrypt.hashSync(
					usuario.password,
					bcrypt.genSaltSync(10)
				);
			},
		},
	}
);

Usuarios.prototype.verificarPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
