// profile.js
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend


const token = localStorage.getItem("token");

// Redirect if no token
if (!token) window.location.href = "../index/index.html";

// Elements
const avatarInput = document.getElementById("avatar-input");
const avatarBtn = document.querySelector(".avatar-change-btn");
const avatarPreview = document.getElementById("profile-avatar");

// Open file picker when button clicked
avatarBtn.addEventListener("click", () => avatarInput.click());

// Show preview when file selected
avatarInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarPreview.src = URL.createObjectURL(file);
  }
});

// Load user profile on page load
async function loadUserProfile() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch profile");

    const user = await res.json();

    // Fill form fields
    document.getElementById("fullname").value = user.username || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phoneNumber || "";
    document.getElementById("location").value = user.location || "";

    // Set avatar
    if (user.profileImage) {
      avatarPreview.src = user.profileImage;
    }
  } catch (err) {
    console.error("Error loading profile:", err);
    alert("Could not load profile data");
  }
}

// Update profile
document.querySelector(".profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("username", document.getElementById("fullname").value.trim());
  formData.append("email", document.getElementById("email").value.trim());
  formData.append("phoneNumber", document.getElementById("phone").value.trim());
  formData.append("location", document.getElementById("location").value.trim());

  if (avatarInput.files[0]) {
    formData.append("image", avatarInput.files[0]); // ✅ match backend
  }

  try {
    const res = await fetch(`${API}/auth/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // JWT
      },
      body: formData, // multipart/form-data
    });

    const data = await res.json();

    if (res.ok) {
      alert("User updated successfully");

      // Refresh fields with updated data
      document.getElementById("fullname").value = data.user.username;
      document.getElementById("email").value = data.user.email;
      document.getElementById("phone").value = data.user.phoneNumber;
      document.getElementById("location").value = data.user.location;

      if (data.user.profileImage) {
        avatarPreview.src = data.user.profileImage;
      }
    } else {
      alert(data.message || "User update failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
});

// Run on page load
window.addEventListener("DOMContentLoaded", loadUserProfile);


























/*

// Set the backend API URL
const API = 'http://localhost:5000/api'; // Uncomment this for local testing

//const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend

const token = localStorage.getItem('token');

if(!token)
	window.location.href = "../index/index.html";



const avatarInput = document.getElementById("avatar-input");
const avatarBtn = document.querySelector(".avatar-change-btn");
const avatarPreview = document.getElementById("profile-avatar");

// Open file picker when button clicked
avatarBtn.addEventListener("click", () => avatarInput.click());

// Show preview when file selected
avatarInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarPreview.src = URL.createObjectURL(file);
  }
});

document.querySelector(".profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("username", document.getElementById("fullname").value.trim());
  formData.append("email", document.getElementById("email").value.trim());
  formData.append("phoneNumber", document.getElementById("phone").value.trim());
  formData.append("location", document.getElementById("location").value.trim());

  if (avatarInput.files[0]) {
    formData.append("image", avatarInput.files[0]);
  }

  try {
    const res = await fetch(`${API}/auth/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // JWT
      },
      body: formData, //  multipart/form-data automatically set
    });

    const data = await res.json();

    if (res.ok) {
      alert("User updated successfully");
    } else {
      alert(data.message || "User update failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
});

*/