// dashboard.js

// ---------------------------
// API URL
// ---------------------------
// Local testing:
//const API = 'http://localhost:5000/api';

// For production, switch to Render:
  const API = "https://fake-drug-verification.onrender.com/api"; // Production backend

// ---------------------------
// Token check
// ---------------------------
const token = localStorage.getItem("token");

if (!token) {
  // redirect to login if no token
  window.location.href = ".index/index.html";
}

//LOGOUT BUTTON
const logoutBtn = document.getElementById("logloglog");

// get logged-in user details
const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("role");

if (userRole !== "admin") {
  alert("Youare not an admin");
  window.location.href = ".index/index.html";
}

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

// ---------------------------
// Elements
// ---------------------------
const productList = document.getElementById("productTableBody");
const totalProVeri = document.getElementById("numberTotal");
const totalProReport = document.getElementById("bTotal");
const totalAwareness = document.getElementById("awareTotal");
const totalUser = document.getElementById("totalUser");

// ---------------------------
// Fetch all verify records
// ---------------------------
async function fetchProducts() {
  try {
    const res = await fetch(`${API}/verify`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // backend ignores if not protected
      },
    });

    const data = await res.json();
    console.log("API Response (/verify):", data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    if (data.verifyAll && data.verifyAll.length > 0) {
      renderProducts(data.verifyAll);
    } else {
      productList.innerHTML = `
        <tr><td colspan="5">No products found</td></tr>
      `;
    }
  } catch (err) {
    console.error("Error fetching products:", err.message);
    productList.innerHTML = `
      <tr><td colspan="5">⚠️ ${err.message}</td></tr>
    `;
  }
}

// ---------------------------
// Render product rows
// ---------------------------
function renderProducts(products) {
  productList.innerHTML = "";

  products.forEach((p) => {
    const row = document.createElement("tr");
    row.classList.add("product-row");

    row.innerHTML = `
      <td>${p.name || "Unnamed"}</td>
      <td>
        <span class="status-badge ${
          p.authentic ? "status-auth" : "status-fake"
        }">
          ${p.authentic ? "✅ Authentic" : "❌ Fake"}
        </span>
      </td>
      <td>${p.category || "N/A"}</td>
      <td>${p.nafdacReg || "N/A"}</td>
      <td>${
        p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"
      }</td>
    `;

    productList.appendChild(row);
  });
}

// ---------------------------
// Fetch stats
// ---------------------------
async function fetchStats() {
  try {
    const res = await fetch(`${API}/stats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Stats Response (/stats):", data);

    if (!res.ok) throw new Error(data.message || "Failed to fetch stats");

    // Some backends wrap stats inside { stats: {...} }
    const stats = data.stats || data;

    console.log("Parsed Stats:", stats);

    totalProVeri.textContent = stats.verifiedCount ?? stats.totalVerified ?? 0;
    totalProReport.textContent =
      stats.reportedCount ?? stats.totalReported ?? 0;
    totalAwareness.textContent =
      stats.awarenessCount ?? stats.totalAwareness ?? 0;
    totalUser.textContent = stats.userCount ?? stats.totalUsers ?? 0;
  } catch (err) {
    console.error("Stats Error:", err.message);
    totalProVeri.textContent = "0";
    totalProReport.textContent = "0";
    totalAwareness.textContent = "0";
    totalUser.textContent = "0";
  }
}

// ---------------------------
// Initial load
// ---------------------------
fetchProducts();
fetchStats();
loadUserProfile();
fetchAwareness();
