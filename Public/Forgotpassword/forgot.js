const axios = require('axios');

async function forgotPassword() {
  let email = document.getElementById("email").value;

  const data = {
    email: email,
  }
  console.log(data);
  
try {
const res = await axios.post('http://44.204.236.201:8081/user/password', data);
    console.log(res);
      if (res.status === 200) {
        console.log(res);
        // localStorage.setItem("token",res.data.token);
        // window.location.href = "home.html";
      }
    } catch (err) {
       window.alert('Plz provide valid Email Id!');
       window.location.href = "/Forgotpassword/forgot.html";
    }
  }

//forgot btn-
document.getElementById('forgot-btn').addEventListener('click', forgotPassword);