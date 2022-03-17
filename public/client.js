async function getText(response) {
  try {
    let text = await response.json();
    return text;
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
  const elem = document.getElementById("container");

  const elem2 = document.getElementById("transfer-money");
  console.log(elem2);
  let table = "<table>";
  let tmp = `<label>From</label>
  <select class="transfter-money__from">
    <option>Ahmed</option>
    <option>Mohamed</option>
    <option>Hussein</option>
  </select>
  <label>To</label>
  <select class="transfter-money__to">
    <option>Ahmed</option>
    <option>Mohamed</option>
    <option>Hussein</option>
  </select>
  <label> Balance </label>
  <input type="number">

  <button class = "send-button"> Transfer </button>

  </button>`;
  let transferMoney = `<label> From </label> <select class="transfter-money__from"`;
  table += "<tr class = \"table-header\">";
  table += `<th> ID </th>`;
  table += `<th> Name </th>`;
  table += `<th> Balance </th>`;
  table += "</tr>";

  for (let i = 0; i < customersData.length; i++) {
    table += "<tr>";
    table += `<th> ${customersData[i].id} </th>`;
    table += `<th> ${customersData[i].name} </th>`;
    table += `<th> ${customersData[i].balance} </th>`;
    table += "</tr>";

    transferMoney += `<option> ${customersData[i].name} </option>`;
  }

  transferMoney += `</select>`;
  transferMoney += `<label>To</label>
  <select class="transfter-money__to">`;

  for (let i = 0; i < customersData.length; i++) {
    transferMoney += `<option> ${customersData[i].name} </option>`;
  }
  table += "</table>";
  transferMoney += `</select>`;
  transferMoney += `<label> Balance </label>
  <input type="number">

  <button class = "send-button"> Transfer </button>

  </button>`;

  console.log(transferMoney);
  elem.innerHTML = table;
  elem2.innerHTML = transferMoney;
}
