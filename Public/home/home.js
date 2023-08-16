const axios = require('axios');

let currentPage = 1;
let itemsPerPage = 5;

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageSpan = document.getElementById('currentPage');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const applyBtn = document.getElementById('applyBtn');

async function initialize() {
      const expenses = await getAllData(currentPage);
      await showData(expenses);
    }

initialize();

async function getAllData(page) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://44.204.236.201:8081/expance/?page=${page}&itemsPerPage=${itemsPerPage}`, { headers: { 'Authorization': token } });
        if (res.data) {
          currentPageSpan.textContent = `${currentPage}`;
          console.log(res.data);
          return res.data;
          
        }
      } catch (err) {
        console.log(err);
      }
    }


async function updatePage(newPage) {
      console.log(newPage);
      currentPage = newPage;
      const expenses = await getAllData(currentPage);
      
      await showData(expenses);
}


prevBtn.addEventListener('click', async () => {
      if (currentPage > 1) {
        console.log("hihi pri");
        await updatePage(currentPage - 1);
      }
    });

nextBtn.addEventListener('click', async () => {
        await updatePage(currentPage + 1)   
    });

applyBtn.addEventListener('click', async () => {
      itemsPerPage = parseInt(itemsPerPageSelect.value);
      await updatePage(1); 
    });


async function add_Data() {
  const token = localStorage.getItem("token");
  let description = document.getElementById("name").value;
  let expenseamount = document.getElementById("amount").value;
  let category = document.getElementById("Extype").value;

  const data = {
    description: description,
    expenseamount: expenseamount,
    category: category
  }
  console.log(data)
  try {
    const res = await axios.post('http://44.204.236.201:8081/expance/add', data, { headers: { 'Authorization': token } });
    console.log(res);
    if (res) {
      updatePage(1);
    }
  } catch (err) {
    console.log(err)
  }

}

async function remove_data(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.delete(`http://44.204.236.201:8081/expance/delete/${id}`,{ headers: { 'Authorization': token } });
    if (res) {
      updatePage(1);
    }

  } catch (err) {
    console.log(err);
  }
}

//show data
function showData(data) {
  
    let arr = data.map((ele) => {
    let str =`<tr>
      <td>${ele.category}</td>
      <td>${ele.description}</td>
      <td>${ele.expenseamount}</td>
      <td><button class="btn btn-danger btn-sm" onclick=remove_data('${ele.id}') >Delete</button>  
      </td>
    </tr>`
    return str;
  });
  
  let html =`<table class="table">`;
      html+=`<thead class="table-primary">`;
      html +=`<tr>
      <th scope="col">Category</th>
      <th scope="col">Description</th>
      <th scope="col">Expense amount</th>
      <th scope="col"></th>
    </tr>`
      html+=`</thead>`
      html +=`<tbody>${arr.join('')}</tbody>`
      html += `</table>`;

  document.getElementById('user-expence-data').innerHTML = html;
  
}

// Event listeners
document.getElementById('submit').addEventListener('click', add_Data);








