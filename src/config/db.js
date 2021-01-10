const Sequelize = require("sequelize");

// * extraer valores de las variables de entorno
require("dotenv").config({ path: "variables.env" });

const { DB_PORT, DB_NOMBRE, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(DB_NOMBRE, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: "mysql",
	port: DB_PORT,
	operatorAliases: false,
	define: {
		timestamp: false,
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

module.exports = sequelize;
