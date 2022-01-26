const facturecontroller = require('../models/facture');

exports.getFcature = async (req, res) => {
    try {
        const { id_user } = req.body;
        const data = await facturecontroller.findAll({
            where: {id_user}
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving data from product table" });

    }
}


exports.addFacture =  async(req, res) => {
    try {
        const {  id_facture,id_user,date_facture,details} = req.body;
        const data = facturecontroller.create({
            id_facture:  id_facture,
            id_user:  id_user,
            date_facture:date_facture,
            details:details });
        res.send(data)
    } catch (error){
        res.status(500).send({ message: error.message || "Some error occurred while adding product" });
    }
}


