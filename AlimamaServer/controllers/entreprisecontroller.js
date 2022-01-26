const entreprisecontroller = require('../models/entreprise');

exports.getEntreprise = async (req, res) => {
    try {
        const {id } = req.body;
        const data = await entreprisecontroller.findAll({
            where: {id}
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving data from entreprise table" });

    }
}


exports.addEntreprise =  async(req, res) => {
    try {
        const {id,id_representant,nom,ville,secteur_activite,mail,logo} = req.body;
        const data = entreprisecontroller.create({
            id:  id,
            id_representant:  id_representant,
            nom:nom,
            ville:ville,
            secteur_activite: secteur_activite,
            mail: mail,
            logo: logo,
        });
        res.send(data)
    } catch (error){
        res.status(500).send({ message: error.message || "Some error occurred while adding entreprise" });
    }
}


