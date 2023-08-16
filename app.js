const express = require('express');
const Expance = require('./models/Expance');
const User = require('./models/users');
const Order = require('./models/order');
const S3report = require('./models/S3report');
const { PORT } = require('./config.js');
const path = require('path');
const sequelize = require('./util/database');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan')
const cors = require('cors');


var app = express();
app.use(cors());

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

// for user routs 
const userRouts = require('./routes/user.js'); 
app.use('/user',userRouts);

// for expance routs 
const ExpanceRoute = require('./routes/expance'); 
app.use('/expance',ExpanceRoute);

// for Purchas routs
const PurchaseRoute = require('./routes/purchase'); 
app.use('/purchase',PurchaseRoute);

// for leaderboard routs
const PrimeMemberRoute = require('./routes/primeMember'); 
app.use('/prime',PrimeMemberRoute);

app.get('/',(req,res)=>{
  res.status(200).send("App Up and running.....");
});

app.use((req,res)=>{
   res.sendFile(path.join(__dirname, `Public/${req.url}`));
})

app.use(errorController.get404);


User.hasOne(Expance); 
Expance.belongsTo(User); 

User.hasOne(Order); 
Order.belongsTo(User);

User.hasOne(S3report); 
S3report.belongsTo(User); 

sequelize
  .sync()
  .then(result => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });


  app.listen(PORT || 8081,()=>{
    console.log(`SERVER is running port no ${PORT}`)
});
