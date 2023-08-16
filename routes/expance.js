const path = require('path');

const express = require('express');

const ExpanceController = require('../controllers/expance');
const authUser  = require('../middleware/auth');
 

const router = express.Router();

router.get('/', authUser.verifyToken, ExpanceController.get_Expense);

router.post('/add',authUser.verifyToken, ExpanceController.add_Expense);

router.delete('/delete/:id',authUser.verifyToken, ExpanceController.delete_Expense);


module.exports = router;