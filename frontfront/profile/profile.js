// profile.js
//const API = "http://localhost:5000/api"; // Local backend
 const API = "https://fake-drug-verification.onrender.com/api"; // Production backend

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






//LOGOUT BUTTON
const logoutBtn = document.getElementById('logloglog')

// get logged-in user details
const userId = localStorage.getItem("userId");


// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = "../index/index.html";
  });
}


//FOR profile image

async function loadUserProfile() {
  try {
    const res = await fetch(`${API}/auth/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("User Profile:", data);

    if (!res.ok) throw new Error(data.message || "Failed to load profile");

    // Show username in welcome text
    const welcomeText = document.querySelector(".welcome-back-john");
    if (welcomeText) {
      welcomeText.textContent = `Welcome back, ${data.username}! Here's your verification overview`;
    }

    // Update profile picture
    const profilePic = document.getElementById("profilePic");
    if (profilePic) {
      profilePic.src = data.profileImage
        ? `${API}${data.profileImage}`
        : "../images/admin-images/Ellipse 1.svg"; // fallback
    }

  } catch (err) {
    console.error("Profile error:", err.message);
  }
}



//List all awareness in drop


// ---------------------------
// Fetch and render awareness (latest 4)
// ---------------------------
async function fetchAwareness() {
  try {
    const res = await fetch(`${API}/awareness?page=1&limit=4`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Awareness Response:", data);

    if (!res.ok) throw new Error(data.message || "Failed to load awareness");

    const awarenessList = data.awareNess || [];

    const container = document.querySelector(".mobile-dashboard-notification");
    container.innerHTML = ""; // clear old

    if (awarenessList.length === 0) {
      container.innerHTML = `<p>No awareness alerts found</p>`;
      return;
    }

    awarenessList.forEach((a) => {
      const item = document.createElement("div");
      item.classList.add("notification-default");
      item.innerHTML = `
        <img class="notification-default-child"
          src="${a.image ? `http://localhost:5000${a.image}` : "../images/admin-images/profile-female.svg"}"
          alt="awareness"
        />
        <div class="mobile-dashboard-notification-frame-parent">
          <div class="miss-jennifer-parent">
            <div class="miss-jennifer">${a.title}</div>
            <div class="view-wrapper"><div class="view">View</div></div>
          </div>
          <div class="fake-product-everywhere">${a.description || "No description"}</div>
          <div class="m-ago">${new Date(a.createdAt).toLocaleDateString()}</div>
        </div>
      `;
      container.appendChild(item);
    });

  } catch (err) {
    console.error("Awareness error:", err.message);
  }
}







loadUserProfile();
fetchAwareness();




















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