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


const allProduct = document.getElementById("allProduct");
const totalProductsEl = document.getElementById("total-products");
const reportedProductsEl = document.getElementById("reported-products");
const verifiedProductsEl = document.getElementById("verified-products");
const newUserEl = document.getElementById("total-users");

const percentProductsEl = document.getElementById("percent-products");
const percentReportedEl = document.getElementById("percent-reported");
const percentVerifiedEl = document.getElementById("percent-verified");
const percentUserEl = document.getElementById("percent-users");


// Fetch stats from backend
async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (res.ok) {
    totalProductsEl.textContent = data.totalProducts || 0;
    reportedProductsEl.textContent = data.totalReportedProducts || 0;
    verifiedProductsEl.textContent = data.totalVerifiedProducts || 0;
    newUserEl.textContent = data.totalUsers || 0;

    percentProductsEl.textContent = `${data.percentProducts ?? 0}% from last month`;
    percentReportedEl.textContent = `${data.percentReportedProducts ?? 0}% from last month`;
    percentVerifiedEl.textContent = `${data.percentVerifiedProducts ?? 0}% from last month`;
    percentUserEl.textContent = `${data.percentUsers ?? 0}% from last month`;
   
   } else {
        console.error("Error:", data);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
}



























//analytics.js

//LOGOUT BUTTON
const logoutBtn = document.getElementById("logloglog");

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
        : "images/images/Ellipse 1.svg"; // fallback
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
        Authorization: `Bearer ${token}`,
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
          src="${
            a.image
              ? `http://localhost:5000${a.image}`
              : "images/images/profile-female.svg"
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

loadUserProfile();
fetchAwareness();

fetchDashboardStats();
