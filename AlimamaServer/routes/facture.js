const express = require('express');
const router = express.Router();

const factureController = require('../controllers/factureController');

router.post('/',  factureController.getFcature);
router.post('/addFacture',  factureController.addFacture);


module.exports = router;
