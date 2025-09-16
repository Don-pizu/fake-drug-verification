// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend

const token = localStorage.getItem('token');

if(!token)
	window.location.href = "../index/index.html";

const allProduct = document.getElementById('allProduct');
const totalProductsEl = document.getElementById("total-products");
const reportedProductsEl = document.getElementById("reported-products");
const verifiedProductsEl = document.getElementById("verified-products");
const newLocationsEl = document.getElementById("new-locations");

const percentProductsEl = document.getElementById("percent-products");
const percentReportedEl = document.getElementById("percent-reported");
const percentVerifiedEl = document.getElementById("percent-verified");
const percentLocationsEl = document.getElementById("percent-locations");




// Fetch stats from backend
async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok) {
      totalProductsEl.textContent = data.totalProducts;
      reportedProductsEl.textContent = data.totalReportedProducts;
      verifiedProductsEl.textContent = data.totalVerifiedProducts;
      newLocationsEl.textContent = data.totalNewLocations;
    } else {
      console.error("Error:", data);
    }
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
  }
}


// Fetch % from last month

async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok) {
      totalProductsEl.textContent = data.totalProducts;
      reportedProductsEl.textContent = data.totalReportedProducts;
      verifiedProductsEl.textContent = data.totalVerifiedProducts;
      newLocationsEl.textContent = data.totalNewLocations;

      // update percentages
      percentProductsEl.textContent = `${data.percentProducts}% from last month`;
      percentReportedEl.textContent = `${data.percentReportedProducts}% from last month`;
      percentVerifiedEl.textContent = `${data.percentVerifiedProducts}% from last month`;
      percentLocationsEl.textContent = `${data.percentNewLocations}% from last month`;
    } else {
      console.error("Error:", data);
    }
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
  }
}


// Helper to render product card
function createProductCard(verify, isApproved) {
  const div = document.createElement('div');
  div.classList.add('product-card-box');

  const image = document.createElement('img');
  image.src = verify.image ? `${API}${verify.image}` : 'images/placeholder.png';
  image.alt = verify.name;
  image.classList.add('product-card-image');

  const name = document.createElement('h4');
  name.textContent = verify.name;
  name.classList.add('product-card-name');

  const authentic = document.createElement('span');
  authentic.textContent = verify.authentic ? "✅ Verified" : "❌ Fake";
  authentic.classList.add('product-card-badge', isApproved ? 'badge-approved' : 'badge-fake');

  const category = document.createElement('p');
  category.textContent = `Category: ${verify.category}`;
  category.classList.add('product-card-category');

  const expiry = document.createElement('p');
  expiry.textContent = `Expiry: ${verify.expiry}`;
  expiry.classList.add('product-card-expiry');

  div.append(image, name, authentic, category, expiry);
  return div;
}

// Fetch all products
async function fetchAll() {
  try {
    const res = await fetch(`${API}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok && Array.isArray(data.verifyAll)) {
      allProduct.innerHTML = "";
      data.verifyAll.forEach(product => {
        const card = createProductCard(product, product.authentic);
        allProduct.appendChild(card);
      });
    } else {
      console.error("Invalid response:", data);
      alert(data.message || 'Could not load products');
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}



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



// Call it
fetchAll();

// Load when page starts
document.addEventListener("DOMContentLoaded", fetchDashboardStats);
