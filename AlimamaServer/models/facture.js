const Sequelize = require('sequelize');
const db = require('../config/database');
const Facture = db.define('Facture', {

    id_facture: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    id_user: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },

    date_facture:{
        type: Sequelize.DATE,
    },
    details:{
        type: Sequelize.STRING,
    }


},{
    createdAt: true,
    updatedAt: true,
});

Facture.sync().then(() => {
    console.log('table facture created');
});


module.exports = Facture;
