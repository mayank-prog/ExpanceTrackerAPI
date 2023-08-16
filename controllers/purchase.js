const RazorPay = require('razorpay');
const User = require('../models/users.js');
const Order = require('../models/order.js');
const { RAZORPAY_KEY_ID,RAZORPAY_KEY_SECRET } = require('../config.js');



exports.purchase_membership = async (req,res)=>{
  try{
    var rzp = new RazorPay({
      key_id : process.env.RAZORPAY_KEY_ID,
      key_secret : process.env.RAZORPAY_KEY_SECRET
    })
    const amount = 150;

    rzp.orders.create({amount, currency:"INR"}, (err,order)=>{
      if(err){
        throw new Error(JSON.stringify(err));
      }
      
      req.user.createOrder({orderId : order.id, status:'PENDING'}).then(()=>{
        return res.status(201).json({order,key_id : rzp.key_id});
      }).catch(err=>{
        throw new Error(err); 
      })
    })
  } catch(err){
    console.log(err);
    res.status(403).json({message : 'Somthing went wrong', error:err})
  }
};


exports.update_status = async (req,res)=>{
  try{
     const {payment_id,order_id} = req.body;
     Order.findOne({where : {orderId:order_id}}).then(order=>{
      order.update({paymentId : payment_id, status : 'SUCCESSFUL'}).then(()=>{
        req.user.update({ispremiumuser:true}).then(()=>{
          return res.status(202).json({sucess : true, message:"Transaction Successfully "});
        }).catch((err)=>{
          cosole.log(err)
           throw new Error(err);
       })
    }).catch((err)=>{
        cosole.log(err)
           throw new Error(err);
       })
  })
  } catch(err){
    console.log(err)
    res.status(403).json({message : 'Somthing went wrong', error:err})
  }
}
  

exports.is_prime = async (req,res)=>{
  try{
    User.findByPk(req.user.id).then(data => {
      let isprime = data.ispremiumuser;
      res.send(isprime);
    }).catch(err => console.log(err));
  }catch(err){
    console.log(err);
  }
}
