//sigin.js

// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = "https://fake-drug-verification.onrender.com/api"; // Production backend

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
      window.location.href = "../index.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
    console.error(err);
  }
});