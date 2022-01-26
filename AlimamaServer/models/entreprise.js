const Sequelize = require('sequelize');
const db = require('../config/database');


const Entreprise = db.define('entreprise', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_representant: {
        type: Sequelize.INTEGER,
        foreignKey: true,
    },
    nom: {
        type: Sequelize.STRING
    },
    ville: {
        type: Sequelize.STRING
    },
    secteur_activite: {
        type: Sequelize.DATE
    },
    mail: {
        unique: true,
        type: Sequelize.STRING,
    },
    logo: {
        type: Sequelize.STRING
    }

},{
    createdAt: true,
    updatedAt: true,
});

Entreprise.sync().then(() => {
    console.log('table entreprise created');
});

module.exports = Entreprise;
