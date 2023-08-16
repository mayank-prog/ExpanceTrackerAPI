
const axios = require('axios');


window.onload = async function(e) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get('http://44.204.236.201:8081/purchase/isprime', { headers: { 'Authorization': token } });
    console.log(res);
    showPayBtn(res.data);
  } catch (err) {
    console.log(err)
  }
}

function showPayBtn(res) {
  if (res) {
    document.getElementById("pay-btn").innerHTML = "<h3 class='text-success'>You are a prime member</h3>";
    let html_download = `<h3>-----Download Report's-----<h3>`;
    GET_download_List();

    document.getElementById("download-text").innerHTML = html_download;

    let download_Html = `<button id="btn-download"  onclick=GET_download() type="click" name="btn-download" class="btn btn-primary"> Download All Expence </button>`

    document.getElementById("download").innerHTML = download_Html;

  } else {
    let html = `<button id="rzp-button1"  onclick=purchasePrime() type="click" name="rzp-button1" class="btn btn-primary">Pay For Prime </button>`

    document.getElementById("pay-btn").innerHTML = html;

    let html_download = `<h3>-----Download Report's-----<h3>`;
    html_download += '<h6 class="text p-4">Our Download Report only for prime member<h6>'
    document.getElementById("download-text").innerHTML = html_download;

  }
}



//use in download section-
async function GET_download_List() {
  console.log("we are in get")
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get('http://44.204.236.201:8081/prime/download', { headers: { 'Authorization': token } });
    if (res) {
      console.log(res);
      Show_download_List(res.data);
    }
  } catch (err) {
    console.log(err)
  }
}


function Show_download_List(data) {
  let arr = data.map((ele) => {
    let str = `<tr>
      <td>${new Date(ele.createdAt).toLocaleString('en-US')}</td>
      <td>
      <a href = "${ele.fileURL}">
        <button class="btn btn-sm btn-primary">Download</button>
      </a>
      </td>
    </tr>`
    return str;
  });

  let html = `<table class="table">`;
  html += `<thead class="table-primary">`;
  html += `<tr>
      <th scope="col">Date</th>
      <th scope="col"></th>
    </tr>`
  html += `</thead>`
  html += `<tbody>${arr.join('')}</tbody>`
  html += `</table>`;

  document.getElementById('download-table').innerHTML = html;
}

//use in download section-
async function GET_download() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get('http://44.204.236.201:8081/prime/downloadexpense', { headers: { 'Authorization': token } });
    if (res) {
      GET_download_List();
      var a = document.createElement("a");
      a.href = res.data.fileURL;
      a.download = 'myexpence.csv';
      a.click();
    }
  } catch (err) {
    console.log(err)
  }
}


async function purchasePrime(e) {
  const token = localStorage.getItem("token");
  const response = await axios.get('http://44.204.236.201:8081/purchase/membership', { headers: { 'Authorization': token } });
  console.log(response);

  var options = {
    "key": response.data.key_id,
    "order_id": response.data.order.id,
    "handler": async function(response) {
      try {
        await axios.post('http://44.204.236.201:8081/purchase/updatestatus', {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        }, { headers: { 'Authorization': token } });
        alert('You are a Premium User Now');
        location.reload();

      } catch (err) {
        console.log("in update", err);
      }
    },
  };

  var rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function(response) {
    console.log(response);
    alert('Something went wrong')
  });
}



