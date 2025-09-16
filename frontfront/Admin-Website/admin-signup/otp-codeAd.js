//otp-code.js

// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend

//Parse query params
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const email = urlParams.get('email');

// Handle Verify button click
document.querySelector('.verify-btn').addEventListener('click', async (e) => {
	e.preventDefault();

	// Collect OTP from 4 inputs
	const otpInputs = document.querySelectorAll('.code-inputs input');
	const otp = Array.from(otpInputs).map(input => input.value).join('');

	if (otp.length !== 4) {
	    alert("Please enter the 4-digit code");
	    return;
	 }

	try {
	    const res = await fetch(`${API}/auth/verifyOtp`, {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({ username, otp })
	    });

	    const data = await res.json();

	    if (res.ok) {
		    alert("Account verified successfully");
		    window.location.href = "../signin.html";
		} else {
		    alert(data.message || "Verification failed");
		  }

	} catch (err) {
	    alert("Something went wrong. Please try again.");
	    console.error(err);
	 }
});



//Handle resend OtP
document.querySelector('.resend-link').addEventListener('click', async (e) => {
	e.preventDefault();

	try {
	    const res = await fetch(`${API}/auth/resendOtp`, {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({ email })
	    });

	    const data = await res.json();

	     if (res.ok) {
		    alert("New OTP sent to email");
		    window.location.href = `otp-code.html?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
		} else {
		    alert(data.message || "Failed to resend OTP");
		  }
	} catch (err) {
	   alert("Something went wrong. Please try again.");
	   console.error(err);
	}

});





