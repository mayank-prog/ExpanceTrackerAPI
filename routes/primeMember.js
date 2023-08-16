const express = require('express');

const PrimeMamberController = require('../controllers/primeMember');
const authUser  = require('../middleware/auth');
const router = express.Router();

router.get('/', authUser.verifyToken, PrimeMamberController.get_Leaderboard);

router.get('/download', authUser.verifyToken, PrimeMamberController.get_Download);

router.get('/downloadexpense',authUser.verifyToken, PrimeMamberController.downloadexpense);

router.get('/expenseReport',authUser.verifyToken, PrimeMamberController.get_ExpenseReport);

module.exports = router;