const express = require('express');
const router = express.Router();

const CommuneController = require('../controllers/productcontroller');

router.post('/',  CommuneController.getProduct);


module.exports = router;
