async function getText(response) {
  try {
    let text = await response.json();
    return text;
  } catch (err) {
    console.log(err);
  }
}

async function sendMoney(from, to, balance) {
  try {
    let data = { from: from, to: to, balance: balance };
    let options = {
      method: "POST", 
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data),
    };
    let response = await (await fetch("https://banking-app101.herokuapp.com/send", options)).text();
    return response;
  } catch (err) {
    console.log(err);
  }
}
async function getCustomers() {
  try {
    let response = await fetch("https://banking-app101.herokuapp.com/customersData");

    if (response.status === 200) {
      let data = getText(response);
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}
let data = getCustomers();

data
  .then((res) => {
    viewCustomers(res);
  })
  .catch((err) => {
    console.log(err);
  });

function viewCustomers(customersData) {
  const elem2 = document.getElementById("transfer-money");

  let transferMoney = `<label> From </label> <select id = "transfter-money__from"class="transfter-money__from">`;

  for (let i = 0; i < customersData.length; i++) {
    transferMoney += `<option> ${customersData[i].name} </option>`;
  }

  transferMoney += `</select>`;
  transferMoney += `<label>To</label>
  <select id = "transfter-money__to" class="transfter-money__to">`;

  for (let i = 0; i < customersData.length; i++) {
    transferMoney += `<option> ${customersData[i].name} </option>`;
  }
  transferMoney += `</select>`;
  transferMoney += `<label> Balance </label>
  <input id = "balance" type="number">

  <button id = "send-button" class = "send-button"> Transfer </button>

  </button>`;

  elem2.innerHTML = transferMoney;

  const btn = document.getElementById("send-button");
  btn.addEventListener("click", function (event) {
     event.preventDefault();

  
    const from = document.getElementById("transfter-money__from");

    const to = document.getElementById("transfter-money__to");

    const balance = document.getElementById("balance");

    let res = sendMoney(from.value, to.value, balance.value);
    res.then(response => {
      console.log(response);

      alert(response);
      window.location = 'transaction-history.html';
    }).catch(err => {
      console.log(err);
    })
    
  });
}



  
