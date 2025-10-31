//index.js
 
// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing
//const APP = 'http://localhost:5000';

const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");


if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000 - Date.now();
  } catch (err) {
    console.error("Invalid token:", err);
    alert("Invalid session. Please log in again.");
    clearUserSession();
    window.location.href = "../signin/signin.html";
  }
} else {
  // redirect to login if no token
  const offline = document.querySelectorAll('.offline');
  offline.forEach(element => element.style.display = 'none'); // remove space from layout

  const offline2 = document.querySelectorAll('.offline2');
  offline2.forEach(element => element.style.visibility = 'hidden'); // keep layout
}


//=========LOGOUT=======/
// ---------- LOGOUT: attach to all .logloglog anchors ----------
const logoutBtns = document.querySelectorAll(".logloglog");
if (logoutBtns && logoutBtns.length > 0) {
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      // redirect to your app's frontend home (use relative path)
      window.location.href = "../index.html";
    });
  });
} else {
  // no logout anchors still shouldn't break other JS
  console.warn("No logout anchors (.logloglog) found");
}
