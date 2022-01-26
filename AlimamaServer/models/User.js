const Sequelize = require('sequelize');
const db = require('../config/database');


const User = db.define('user', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    ville: {
        type: Sequelize.STRING
    },
    date_naissance: {
        type: Sequelize.DATE
    },
    mail: {
        unique: true,
        type: Sequelize.STRING,
    },
    telephone: {
        type: Sequelize.STRING
    },
    mot_de_passe: {
        type: Sequelize.STRING
    },
    code_activation: {
        type: Sequelize.STRING
    },
    confirmation_admin: {
        type: Sequelize.BOOLEAN
    },
    compte_status: {
        type: Sequelize.BOOLEAN
    },

},{
    createdAt: true,
    updatedAt: true,
});

User.sync().then(() => {
    console.log('table user created');
});

module.exports = User;
