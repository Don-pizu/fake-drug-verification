//sigin.js

// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

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


document.querySelector(".btn").addEventListener("click", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      //Save token for future requests
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data._id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      alert("Login successful!");
      window.location.href = "../homepage/homepage.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
    console.error(err);
  }
});



