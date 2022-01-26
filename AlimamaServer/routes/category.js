const express = require('express');
const router = express.Router();

const factureController = require('../controllers/CategorieController');

router.post('/',  factureController.addCategory);



module.exports = router;
