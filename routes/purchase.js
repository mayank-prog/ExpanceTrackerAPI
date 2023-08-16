const express = require('express');

const PurchaseController = require('../controllers/purchase');
const authUser  = require('../middleware/auth');
const router = express.Router();

router.get('/membership', authUser.verifyToken, PurchaseController.purchase_membership);

router.post('/updatestatus',authUser.verifyToken, PurchaseController.update_status);

router.get('/isprime', authUser.verifyToken, PurchaseController.is_prime);



module.exports = router;