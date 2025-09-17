// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

  const API = "https://fake-drug-verification.onrender.com/api"; // Production backend



document.querySelector('.signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phone').value;
  const location = document.getElementById('location').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('userRole').value;

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, phoneNumber, location, password, confirmPassword, role })
    });

    const data = await res.json();

    if (res.ok) {
      // After successful registration
      localStorage.setItem("userId", data._id);
      localStorage.setItem("role", data.role);
      alert('User registered. Verify OTP sent to email');
      // Redirect to OTP page with username + email
      window.location.href = `verification-linkAd.html?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
    console.error(err);
  }
});
