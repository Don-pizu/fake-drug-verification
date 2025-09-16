// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend




document.querySelector('.signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phone').value; // ✅ match backend
  const location = document.getElementById('location').value;
  const password = document.getElementById('password').value; // ✅ fixed typo
  const confirmPassword = document.getElementById('confirmPassword').value; // ✅ fixed typo

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, phoneNumber, location, password, confirmPassword })
    });

    const data = await res.json();

    if (res.ok) {
      alert('User registered. Verify OTP sent to email');
      window.location.href = "verification-link.html";window.location.href = `verification-link.html?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
    console.error(err);
  }
});


