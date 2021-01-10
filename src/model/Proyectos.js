const Sequelize = require('sequelize');
const slug = require("slug");
const shortid = require("shortid");

const db = require("../config/db");

const Proyectos = db.define("proyectos",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:Sequelize.STRING(100),
    url: Sequelize.STRING(100)
},{
    hooks: {
        beforeCreate(proyecto){
            // console.log("Antes de Insertar en la DB");
            const url = slug(proyecto.nombre).toLowerCase();
            // % slug(): funcion que transforma la palabra ingresada como un url
            proyecto.url = `${url}-${shortid.generate()}`;
        }
        // % aqui inserta en la db el campo que se le esta indicando es decir la url
    }
    // % hooks: funciones que se ejecutan antes o despues de una inserccion a la db
});

module.exports = Proyectos;