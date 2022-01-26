const Productcontroller = require('../models/produit');

exports.getProduct = async (req, res) => {
    try {
        const { id_produit } = req.body;
        const data = await Productcontroller.findAll({
            where: {id_produit}
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving data from product table" });

    }
}


exports.addProduct =  async(req, res) => {
    try {
        const { isPremium,Picture,prix,description,id_fournisseur,id_vendeur,id_produit} = req.body;
        const data = Productcontroller.create({
            isPremium: isPremium,
            Picture: Picture,
            prix: prix,
            description: description,
            id_fournisseur: id_fournisseur,
            id_vendeur: id_vendeur,
            id_produit: id_produit });
        res.send(data)
    } catch (error){
        res.status(500).send({ message: error.message || "Some error occurred while adding product" });
    }
}

exports.getProductByCategory = (req, res) =>{
  try{
      const {category} = req.body;
      const data = Productcontroller.findAll({
          where : {category}
      });
      res.send(data)
  } catch (error){
      res.status(500).send({ message: error.message || "Some error occurred while adding product by category" });
  }
}
