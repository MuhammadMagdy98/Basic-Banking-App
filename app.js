const my_sql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();

var con = my_sql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});
const app = express();


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

const port = process.env.PORT || 3001;


app.use(express.static('public'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.post('/create-user', (req, res) => {
  
  // TODO

  res.status(200).send('OK');
});


app.get('/customersData', (req, res) => {
  con.query('select * from customers', (err, result) => {
    if (err) throw err;
    result = JSON.parse(JSON.stringify(result));
    res.status(200).send(result);

  });
});

app.get('/transactionHisory', (req, res) => {
  con.query('select * from transaction_history', (err, result) => {
    if (err) throw err;
    result = JSON.parse(JSON.stringify(result));
    res.status(200).send(result);
  });
});
app.post('/send', (req, res) => {
  let fromName = req.body.from;
  let balance = req.body.balance;
  let toName = req.body.to;

  fromName = fromName.split(' ')[0];
  toName = toName.split(' ')[0];
  if (fromName === toName) {
    res.status(200).send(`You can't transfer to yourself.`);
    return;
  }
  if (balance.length === 0) {
    res.status(200).send(`Balance can't be empty`);
  }
  if (isNaN(balance)) {
    res.status(200).send('Balance must be a number');
    return;
  }
  if (balance <= 0) {
    res.status(200).send('Balance must be positive');
    return;
  }
  con.query(`select * from customers where name='${fromName}'`, (err, result, fields) => {
    if (err) throw err;

    result = JSON.parse(JSON.stringify(result));

    const cust = result[0];
    
    const remainingBalance = cust.balance - balance;
    if (remainingBalance < 0) {
      res.status(416).send(`You don't have enough balance.`);
    } else {
      con.query(`update customers set balance=${remainingBalance} where name='${fromName}'`, (err, result) => {
      let currentDate = new Date().toLocaleString();
      console.log(currentDate);
        con.query(`insert into transaction_history (sender_name, receiver_name, transaction_time, balance)
        values ('${fromName}', '${toName}', '${currentDate}', ${balance})`, (err, result) => {
          if (err) throw err;
          console.log('date updated');
        });
        if (err) throw err;
        
        con.query(`update customers set balance = balance + ${balance} where name='${toName}'`, (err, result) => {
          if (err) throw err;
          res.status(200).send('Transaction is successful');
        });
        
      });
      

    }
  });
});
con.connect(function(err) {
  if (err) throw err;


  console.log("Connected!");

 
});