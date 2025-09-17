//reset-password.js

// API endpoint
// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

  const API = "https://fake-drug-verification.onrender.com/api"; // Production backend

  const params = new URLSearchParams(window.location.search);
  const token = window.location.pathname.split("/").pop();

  document.getElementById("resetForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const res = await fetch(`${API}/auth/reset-password/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirmPassword }),
    });

    const data = await res.json();
    document.getElementById("resetMessage").textContent = data.message;
  });