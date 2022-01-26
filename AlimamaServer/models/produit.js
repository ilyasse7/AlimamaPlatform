const Sequelize = require('sequelize');
const db = require('../config/database');
const Produit = db.define('Produit', {

    id_produit: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    id_vendeur: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },

    id_fournisseur:{
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    description:{
        type: Sequelize.STRING,
    },

    prix:{
        type: Sequelize.STRING,
    },

    isPremium:{
        type: Sequelize.BOOLEAN,
    },

    Picture:{
        type: Sequelize.BLOB,
    },


},{
    createdAt: true,
    updatedAt: true,
});

Produit.sync().then(() => {
    console.log('table produit created');
});


module.exports = Produit;
