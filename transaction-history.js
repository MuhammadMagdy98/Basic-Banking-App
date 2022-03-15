async function getText(response) {
  try {
    let text = await response.json();
    return text;
  } catch (err) {
    console.log(err);
  }
}

async function getHistory() {
  try {
    let response = await fetch("http://localhost:3001/transactionHisory");

    if (response.status === 200) {
      let data = getText(response);
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}
let data = getHistory();

data
  .then((res) => {
    viewCustomers(res);
  })
  .catch((err) => {
    console.log(err);
  });


  function viewCustomers(customersData) {
    const elem = document.getElementById("container");
    let table = "<table>";
  
    table += "<tr>";
    table += `<th> ID </th>`;
    table += `<th> Sender Name </th>`;
    table += `<th> Receiver Name </th>`;
    table += `<th> Balance </th>`;
    table += `<th> Time </th>`;
    table += "</tr>";
  
    for (let i = 0; i < customersData.length; i++) {
      table += "<tr>";
      table += `<th> ${customersData[i].id} </th>`;
      table += `<th> ${customersData[i].sender_name} </th>`;
      table += `<th> ${customersData[i].receiver_name} </th>`;
      table += `<th> ${customersData[i].balance} </th>`;
      table += `<th> ${customersData[i].transaction_time} </th>`;
      table += "</tr>";
  
    }
  
   
    table += "</table>";
  
    elem.innerHTML = table;
  }
  
