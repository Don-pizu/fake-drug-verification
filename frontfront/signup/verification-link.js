// verification-link.js

// Get username & email from query params (sent from register response redirect)
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");
const email = urlParams.get("email");

// Update the Continue link with real values
const continueLink = document.querySelector(".verify a");
if (username && email) {
  continueLink.href = `../signup/otp-code.html?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
} else {
  console.warn("Username or email missing in query params.");
}
