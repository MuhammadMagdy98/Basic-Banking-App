const my_sql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();

var con = my_sql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const port = process.env.PORT || 3001;

app.use(express.static("public"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/create-user", (req, res) => {
  // TODO

  res.status(200).send("OK");
});

app.get("/customersData", (req, res) => {
  con.query("select * from customers", (err, result) => {
    if (err) throw err;
    result = JSON.parse(JSON.stringify(result));
    res.status(200).send(result);
  });
});

app.get("/transactionHisory", (req, res) => {
  con.query("select * from transaction_history", (err, result) => {
    if (err) throw err;
    result = JSON.parse(JSON.stringify(result));
    res.status(200).send(result);
  });
});

function validateBalance(balance) {
  return new Promise((resolve, reject) => {
    if (balance.length === 0) {
      resolve({ valid: false, msg: `Balance can't be empty` });
    } else if (!(Number(balance) == balance)) {
      resolve({ valid: false, msg: `Balance is not a number` });
    } else if (balance % 1 != 0) {
      resolve({ valid: false, msg: `Balance should be an integer` });
    } else if (balance <= 0) {
      resolve({
        valid: false,
        msg: `Balance must be a positive integer`,
      });
    }

    resolve({ valid: true, msg: "" });
  });
}

function customerExist(customer) {
  return new Promise((resolve, reject) => {
    con.query(
      `select * from customers where name='${customer}'`,
      (err, result, fields) => {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));

        if (result.length === 0) {
          resolve({ valid: false, msg: `Invalid Data` });
        } else {
          resolve({ valid: true, msg: "" });
        }
      }
    );
  });
}
function validateCustomer(customer) {
  return new Promise((resolve, reject) => {
    if (customer.length === 0) {
      resolve({ valid: false, msg: `Invalid Data` });
    }

    for (let i = 0; i < customer.length; i++) {
      let code = customer.charCodeAt(i);
      if (
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) // lower alpha (a-z)
      ) {
        resolve({ valid: false, msg: `Invalid Data` });
      }
    }

    resolve({ valid: true, msg: `Invalid Data` });
  });
}

async function updateCustomer(fromName, toName, balance) {
  return new Promise((resolve, reject) => {
    con.query(
      `select * from customers where name='${fromName}'`,
      (err, result, fields) => {
        if (err) throw err;

        result = JSON.parse(JSON.stringify(result));

        const cust = result[0];

        const remainingBalance = cust.balance - balance;
        if (remainingBalance < 0) {
          resolve({ valid: false, msg: `You don't have enough balance.` });
        } else {
          con.query(
            `update customers set balance=${remainingBalance} where name='${fromName}'`,
            (err, result) => {
              let currentDate = new Date().toLocaleString();
              console.log(currentDate);
              con.query(
                `insert into transaction_history (sender_name, receiver_name, transaction_time, balance)
        values ('${fromName}', '${toName}', '${currentDate}', ${balance})`,
                (err, result) => {
                  if (err) throw err;
                  console.log("date updated");
                }
              );
              if (err) throw err;

              con.query(
                `update customers set balance = balance + ${balance} where name='${toName}'`,
                (err, result) => {
                  if (err) throw err;
                  resolve({ valid: true, msg: "Transaction is successful" });
                }
              );
            }
          );
        }
      }
    );
  });
}
async function handlePromises(fromName, toName, balance) {
  let res = await validateBalance(balance);

  if (!res.valid) {
    return res;
  }

  res = await validateCustomer(fromName);

  if (!res.valid) {
    return res;
  }

  res = await customerExist(fromName);

  if (!res.valid) {
    return res;
  }

  res = await validateCustomer(toName);

  if (!res.valid) {
    return res;
  }

  res = await customerExist(toName);

  if (!res.valid) {
    return res;
  }

  if (res) {
    if (fromName == toName) {
      return {valid: false, msg: `You can't transfer to yourself`};
    }
  }

  res = await updateCustomer(fromName, toName, balance);

  return res;
}
app.post("/send", (req, res) => {
  let fromName = req.body.from;
  let balance = req.body.balance;
  let toName = req.body.to;

  fromName = fromName.split(" ")[0];
  toName = toName.split(" ")[0];

  handlePromises(fromName, toName, balance).then((result) => {
    res.status(200).send(result.msg);
  });

  // console.log(result);
});
con.connect(function (err) {
  if (err) throw err;

  console.log("Connected!");
});
