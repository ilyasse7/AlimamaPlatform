const categoryController = require('../models/category');




exports.addCategory =  async(req, res) => {
    try {
        const {id,id_produit,libelle,groupe} = req.body;
        const data = categoryController.create({
            id:  id,
            id_produit:  id_produit,
            libelle:libelle,
            groupe:groupe,
        });
        res.send(data)
    } catch (error){
        res.status(500).send({ message: error.message || "Some error occurred while adding category" });
    }
}


