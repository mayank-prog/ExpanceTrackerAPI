
const axios = require('axios');
// POST REQUEST
async function log_in() {

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const data = {
    email: email,
    password: password
  }
  console.log(data);

  try {
    const res = await axios.post('http://44.204.236.201:8081/user/login', data);
    if (res.status === 200) {
      console.log(res)
      localStorage.setItem("token", res.data.token);
      window.location.href = "home/home.html";
    }
  } catch (err) {
    console.log(err);
    window.alert('Check Your Passwerd and email ID!');
  }
}

async function sign_up() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const data = {
    name: name,
    email: email,
    password: password
  }
  console.log(data);
  try {
    const res = await axios.post('http://44.204.236.201:8081/user/signup', data);
    console.log(res);
    if (res.status === 200) {
      console.log(res);
      localStorage.setItem("token", res.data.token);
      window.location.href = "home/home.html";
    }
  } catch (err) {
    window.alert('User already exists!');
    window.location.href = "index.html";
  }
}

// Event listeners
if (document.getElementById('form-login-btn')) {
  document.getElementById('form-login-btn').addEventListener('click', log_in);
}

if (document.getElementById('sign_up-btn')) {
  document.getElementById('sign_up-btn').addEventListener('click', sign_up);
}

