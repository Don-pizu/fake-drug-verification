//reset-pw-email.js

// API endpoint
// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

  const API = "https://fake-drug-verification.onrender.com/api"; // Production backend

document.querySelector(".resetClass").addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailReset = document.getElementById("reset-pw").value.trim();

  if (!emailReset) {
    alert("Email is required");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/forgotPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailReset }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
    } else {
      document.querySelector(".verify-p").textContent = data.message;
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Error sending reset email");
  }
});