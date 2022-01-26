const express = require('express');
const router = express.Router();

const factureController = require('../controllers/entreprisecontroller');

router.post('/',  factureController.getEntreprise);
router.post('/addEntreprise',  factureController.addEntreprise);


module.exports = router;
