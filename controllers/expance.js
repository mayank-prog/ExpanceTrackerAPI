const Expance = require('../models/Expance');
const User = require('../models/users.js');
const Order = require('../models/order.js');
const sequelize = require('../util/database');


exports.get_Expense = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) ; 
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 5; 
    const offset = (page - 1) * itemsPerPage;
    console.log(page);
    const data = await Expance.findAll({
      where: { usersEId: req.user.id },
      limit: itemsPerPage,
      offset: offset,
    });

    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal Server Error');
  }
};


exports.add_Expense = async (req, res, next) => {
  const t = await sequelize.transaction();
try {
  const {expenseamount,description,category} = req.body;
  if(expenseamount == undefined || expenseamount.length === 0){
    return res.status(400).json({success : false, massage:'Perameters missing'})
  }
  
  const expense = await Expance.create(
    { expenseamount, description, category, usersEId: req.user.id },
    { transaction: t }
  );

  const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
  await User.update(
    {
      totalExpenses: totalExpense
    },
    {
      where: { id: req.user.id },
      transaction: t
    }
  );
  await t.commit();
  res.status(200).json({ expense: expense });
  
} catch (err) {
  await t.rollback();
  return res.status(500).json({ success: false, err: err });
}

};

exports.delete_Expense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    
  const Exp_Id = req.params.id;

  if(Exp_Id == undefined){
    return res.status(400).json({success : false, massage:'Perameters missing'})
  }

  const expens = await Expance.findByPk(Exp_Id ,
    { transaction: t}
  );
  let amount = expens.expenseamount;
  
  await Expance.destroy({ where: { id: Exp_Id } },
    { transaction: t}
  );

  const totalExpense = Number(req.user.totalExpenses) - Number(amount);
  
  console.log(totalExpense);
  
  await User.update(
    {
      totalExpenses: totalExpense
    },
    {
      where: { id: req.user.id },
      transaction: t
    }
  );
    
  await t.commit();
  res.status(200).json({message : "Delete Successfully",amount : "amount" });
  
} catch (err) {
  // await t.rollback();
  return res.status(500).json({ success: false, err: err });
}
  
};


 
