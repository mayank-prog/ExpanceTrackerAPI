const User = require('../models/users.js');
const Order = require('../models/order.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SENDER_EMAIL,SENDINBLUE_KEY_SECRT } = require('../config.js');

const SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = SENDINBLUE_KEY_SECRT;


exports.user_login = async (req, res, next) => {
try{
const {email, password} = req.body;
  
if(!email && !password){
    return res.status(400).json({message : "Somthing is missing!"});
}  
const user = await User.findAll({ where: { email } });
  if(user.length>0){
    bcrypt.compare(password, user[0].password, (err, result)=>{
      if(err){
         return res.status(500).json({success : false, message : "Plz check your password again!"});
      }
      if(result == true){
        return  res.status(200).json({success : true ,message : "User logeed in Successfully" ,token : generateAccessToken(user[0].id, user[0].name)});
      }
    })
  }else{
    return res.status(404).json({success : false, message : "User does not exist!"});
  }
}catch(err){
  console.log(err);
  return res.status(500).json({success : flase, message : err});
}
};


exports.user_signup = async (req, res, next) => {
  try {
  const {name, email, password} = req.body;
  if(!name && !email && !password){
    return res.status(400).json({message : "Somthing is missing!"});
  }
  const saltrounds = 10;
  bcrypt.hash(password, saltrounds, async (err,hash)=>{
    console.log(err);
    const user = await User.create({name, email, password:hash});
    res.status(200).json({message:'Successfuly create new user', token : generateAccessToken(user.id, user.name)});
  })
  }catch(err) {
      res.status(500).json(err);
    }
};

exports.forgot_password =async (req, res)=>{

  const {email} = req.body;
  console.log(email);
  
  if(!email){
    return res.status(400).json({message : "Somthing is missing!"});
  }
try{
  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()
  const sender = {
        email:SENDER_EMAIL
    }
    const receivers = [
        {
            email: email,
        },
    ]

    
const data = tranEmailApi.sendTransacEmail({sender,
                                            to: receivers,
                                            subject: 'Your Password is...',
        textContent: `
        try to log in with this password {{params.password}} with mail id {{params.email}}.
        `,
        params: {
            password: '12345',
            email : email
        },
    });
    
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    res.status(200).json({message:"Dome"});
   
  } catch(error) {
    console.log(error)
    res.status(500).json(error);
  }

}

function generateAccessToken(id, name) {
  return jwt.sign({userId :id, name:name }, 'key');
}

