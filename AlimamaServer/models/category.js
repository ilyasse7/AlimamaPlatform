const Sequelize = require('sequelize');
const db = require('../config/database');


const Category = db.define('Categorie', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_produit: {
        type: Sequelize.INTEGER,
        foreignKey: true,
    },
    libelle: {
        type: Sequelize.STRING,
    },
    groupe: {
        type: Sequelize.STRING
    },


},{
    createdAt: true,
    updatedAt: true,
});

Category.sync().then(() => {
    console.log('table Category created');
});

module.exports = Category;
