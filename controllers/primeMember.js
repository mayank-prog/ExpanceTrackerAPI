const User = require('../models/users.js');
const Order = require('../models/order.js');
const Expance = require('../models/Expance');
const S3report = require('../models/S3report');

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const S3Service = require('../services/S3Service');

exports.get_Download = async (req,res)=>{
  try{
   const response = await S3report.findAll({ where: { usersEId : req.user.id }});
    if(response){
      return res.status(200).send(response);  
    } 
    
  }catch(err){
    console.log(err);
  }
}

exports.downloadexpense = async (req, res) => {
  try {
     const expenses = await Expance.findAll({ where: { usersEId : req.user.id }});
     const stringifiedExpenses = JSON.stringify(expenses);
     
     // it should depenfd upon the userid
    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Service.uploadToS3(stringifiedExpenses, filename);
    
    await req.user.createS3report({fileURL:fileURL}).then(()=>{
        res.status(200).json({fileURL, success: true});
      }).catch(err=>{
        throw new Error(err); 
      })
    
  }catch(err){
    console.log(err);
    res.status(500).json({fileURL: '', success: false, err: err})
  }
} 

exports.get_Leaderboard = async (req,res)=>{
  try{
   const response = await User.findAll({
        order: [
            ['totalExpenses', 'ASC'],
        ],
        attributes: ['name', 'totalExpenses']
    });
    
    if(response){
      return res.status(200).send(response);  
    } 
    
  }catch(err){
    console.log(err);
  }
}

exports.get_ExpenseReport = async (req, res) => {
  try {
    const data = await Expance.findAll({where: { usersEId: req.user.id }});
    return res.status(200).send(data);
     // const result = await Expance.findAll({
     //  attributes: [
     //      [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
     //      [sequelize.fn('SUM', sequelize.col('expenseamount')), 'totalAmount'],
     //  ],
     //   group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
     //   order: [[sequelize.col('date'), 'ASC']],
     //   raw: true // Use raw:true to get plain JSON objects instead of Sequelize instances
     // });

  // Calculate the overall total expenses
  // const overallTotalExpenses = result.reduce((total, item) => total + item.totalAmount, 0);

  // Add overallTotalExpenses to each result item
  // result.forEach(item => {
  //   item.overallTotalExpenses = overallTotalExpenses;
  // });

  // res.json(result);

    
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal Server Error');
  }
};

//old way to get leaderboard....

// exports.get_Leaderboard = async (req,res)=>{
//   try{
//     const leaderboardData = await sequelize.query("SELECT exp_users.name, SUM(expance_users.amount) AS totalExpenses FROM exp_users JOIN expance_users ON exp_users.id = expance_users.expUserId GROUP BY exp_users.id ORDER BY `totalExpenses` DESC; ", { type: Sequelize.QueryTypes.SELECT });
//     res.status(200).send(leaderboardData);
//   }catch(err){
//     console.log(err);
//   }
// }
