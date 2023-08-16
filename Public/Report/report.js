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
    let html_leaderboard = `<h3>-----Your Report's -----<h3>`;
    GET_Reports();

    document.getElementById("report-text").innerHTML = html_leaderboard;

  } else {
    let html = `<button id="rzp-button1"  onclick=purchasePrime() type="click" name="rzp-button1" class="btn btn-primary">Pay For Prime </button>`

    document.getElementById("pay-btn").innerHTML = html;

    let html_leaderboard = `<h3>-----Your Report's-----<h3>`;
    html_leaderboard += "<h6 class='text p-4'>Report's only for prime member<h6>"
    document.getElementById("report-text").innerHTML = html_leaderboard;

  }
}


async function GET_Reports() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get('http://44.204.236.201:8081/prime/expenseReport', { headers: { 'Authorization': token } });
    if (res) {
      // console.log(res.data)
      const expensesByDate = {};

      // Iterate through the SQL response
      res.data.forEach(expense => {
        const createdAt = new Date(expense.createdAt).toDateString();

        if (!expensesByDate[createdAt]) {
          expensesByDate[createdAt] = {
            expenses: [],
            totalAmount: 0
          };
        }

        expensesByDate[createdAt].expenses.push(expense);
        expensesByDate[createdAt].totalAmount += parseFloat(expense.expenseamount);
      });
      console.log(expensesByDate);

      // Show_Report_Day_to_Day(expensesByDate);
      Show_Report_Till_UpTo(expensesByDate);
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


function Show_Report_Day_to_Day(data) {
  let arr = data.map((ele) => {
    let str = `<tr>
      <td>${ele.name}</td>
      <td>${ele.totalExpenses}</td>
    </tr>`
    return str;
  });

  let html = `<table class="table">`;
  html += `<thead class="table-primary">`;
  html += `<tr>
      <th scope="col">Name</th>
      <th scope="col">Total Expence</th>
    </tr>`
  html += `</thead>`
  html += `<tbody>${arr.join('')}</tbody>`
  html += `</table>`;

  document.getElementById('leaderboard-table').innerHTML = html;
}


function Show_Report_Till_UpTo(data) {


  let newarrr = [];
  let arr = Object.entries(data).forEach(entry => {
    const [key, value] = entry;
    let str3 = `<tr class="table-info">
          <td>${key}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>`;
    newarrr.push(str3);
    Object.entries(value).forEach(entry1 => {
      const [key1, value1] = entry1;
      let a2, a1;
      if (Array.isArray(value1)) {
        let arr1 = value1.map((ele) => {
          let str2 = `<tr>
          <td></td>
          <td>${ele.category}</td>
          <td>${ele.description}</td>
          <td>${ele.expenseamount}</td>
        </tr>`;
          return str2;
        })
        a2 = arr1.join('');
      } else {
        a1 = `<tr class="table-success" >
          <td></td>
          <td></td>
          <td></td>
          <td class="text-danger">Total Expance-${value1}</td>
        </tr>`;
      }
      a2 ? newarrr.push(a2) : newarrr.push(a1);
      return newarrr.push(a2);
    })
  });
  // let arr = data.map((ele) => {
  //   let str =`<tr>
  //     <td>${ele.name}</td>
  //     <td>${ele.totalExpenses}</td>
  //   </tr>`
  //   return str;
  // });



  let html = `<table class="table table-sm">`;
  html += `<thead class="table-dark">`;
  html += `<tr>
      <th scope="col">Date</th>
      <th scope="col">Description</th>
      <th scope="col">category</th>
      <th scope="col">Expenseamount</th>
    </tr>`
  html += `</thead>`
  html += `<tbody>${newarrr.join('')}</tbody>`
  html += `</table>`;

  document.getElementById('leaderboard-table').innerHTML = html;
}

