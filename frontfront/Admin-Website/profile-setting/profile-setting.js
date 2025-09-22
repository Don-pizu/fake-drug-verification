// profile.js

window.addEventListener("error", (e) => {
  console.error("Global error caught:", e.message, "at", e.filename, ":", e.lineno);
});

// const API = 'http://localhost:5000/api'; // Local backend
  const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
  const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

  // ================= USER ROLE CHECK =================
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) 
    window.location.href = "../index.html";

  if (userRole !== "admin") {
    alert("You are not an admin");
    window.location.href = "https://fake-drug-verification.onrender.com";
  }

// Elements
const profileForm = document.getElementById("profileForm");
const avatarInput = document.getElementById("avatarInput");
const avatarBtn = document.querySelector(".form-image");
const avatarPreview = document.getElementById("profile-avatar");

// Open file picker when button clicked
avatarPreview.addEventListener("click", () => avatarInput.click());


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
    console.log("Fetching profile...");
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Profile response status:", res.status);

    if (!res.ok) throw new Error("Failed to fetch profile");

    const user = await res.json();
    console.log("User from API:", user);

    // Fill form fields
    document.getElementById("fullname").value = user.username || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phoneNumber || "";
    document.getElementById("location").value = user.location || "";

    // Set avatar
    if (user.profileImage) {
      // Ensure full URL
      avatarPreview.src = user.profileImage.startsWith("http")
        ? user.profileImage
        : `${APP}${user.profileImage}`;
    }

  } catch (err) {
    console.error("Error loading profile:", err);
    alert("Could not load profile data");
  }
}

// Update profile
document
  .querySelector(".profile-form-inner")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "username",
      document.getElementById("fullname").value.trim()
    );
    formData.append("email", document.getElementById("email").value.trim());
    formData.append(
      "phoneNumber",
      document.getElementById("phone").value.trim()
    );
    formData.append(
      "location",
      document.getElementById("location").value.trim()
    );

    if (avatarInput.files[0]) {
       console.log("Avatar selected:", avatarInput.files[0].name);
      formData.append("image", avatarInput.files[0]); 
    } else {
  console.log("No avatar selected");
}


    console.log("Submitting profile update...");

    try {
      const res = await fetch(`${API}/auth/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // JWT
        },
        body: formData, // multipart/form-data
      });

       console.log("Update response status:", res.status);

      const data = await res.json();

      console.log("Update response data:", data);


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







//LOGOUT BUTTON
const logoutBtn = document.getElementById("logloglog");

// get logged-in user details
const userId = localStorage.getItem("userId");

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = ".index/index.html";
  });
}

/*
//FOR profile image

async function loadUserProfile() {
  try {
    const res = await fetch(`${API}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
        : "images/Ellipse 1.svg"; // fallback
    }
  } catch (err) {
    console.error("Profile error:", err.message);
  }
}
*/
//List all awareness in drop

// ---------------------------
// Fetch and render awareness (latest 4)
// ---------------------------
async function fetchAwareness() {
  try {
    const res = await fetch(`${API}/awareness?page=1&limit=4`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Awareness Response:", data);

    if (!res.ok) throw new Error(data.message || "Failed to load awareness");

    const awarenessList = data.awareness || [];

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
          src="${
            a.image
              ? `${API}${a.image}`
              : "images/profile-female.svg"
          }"
          alt="awareness"
        />
        <div class="mobile-dashboard-notification-frame-parent">
          <div class="miss-jennifer-parent">
            <div class="miss-jennifer">${a.title}</div>
            <div class="view-wrapper"><div class="view">View</div></div>
          </div>
          <div class="fake-product-everywhere">${
            a.description || "No description"
          }</div>
          <div class="m-ago">${new Date(a.createdAt).toLocaleDateString()}</div>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error("Awareness error:", err.message);
  }
}


fetchAwareness();

// Run on page load
window.addEventListener("DOMContentLoaded", loadUserProfile);


