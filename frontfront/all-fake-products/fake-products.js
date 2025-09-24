// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

const token = localStorage.getItem("token");

if (!token) window.location.href = "../index.html";

const allProduct = document.getElementById("allProduct");
const totalProductsEl = document.getElementById("total-products");
const reportedProductsEl = document.getElementById("reported-products");
const verifiedProductsEl = document.getElementById("verified-products");
const newLocationsEl = document.getElementById("new-locations");

const percentProductsEl = document.getElementById("percent-products");
const percentReportedEl = document.getElementById("percent-reported");
const percentVerifiedEl = document.getElementById("percent-verified");
const percentLocationsEl = document.getElementById("percent-locations");



//for this type of date 27 Sept 2025
// Format date function
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}



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
    newLocationsEl.textContent = data.totalNewLocations || 0;

    percentProductsEl.textContent = `${data.percentProducts ?? 0}% from last month`;
    percentReportedEl.textContent = `${data.percentReportedProducts ?? 0}% from last month`;
    percentVerifiedEl.textContent = `${data.percentVerifiedProducts ?? 0}% from last month`;
    percentLocationsEl.textContent = `${data.percentNewLocations ?? 0}% from last month`;
   
   } else {
        console.error("Error:", data);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
}



// Helper to render product card
function createProductCard(verify, isApproved) {
  const div = document.createElement("div");
  div.classList.add("product-card");

  // Image
  const image = document.createElement("img");
  image.src = verify.image ? `${APP}${verify.image}` : "images/placeholder.png";
  image.alt = verify.name;
  image.classList.add("product-image");

  // Details
  const details = document.createElement("div");
  details.classList.add("product-details");

  const name = document.createElement("h4");
  name.textContent = verify.name;
  name.classList.add("product-card-name");

  const authentic = document.createElement("span");
  authentic.textContent = verify.authentic ? "✅ Verified" : "❌ Fake";
  authentic.classList.add(
    "product-card-badge",
    isApproved ? "badge-approved" : "badge-fake"
  );

  const category = document.createElement("p");
  category.textContent = `Category: ${verify.category || verify.catgory || "N/A"}`;

  const expiry = document.createElement("p");
  expiry.textContent = `Expiry: ${formatDate(verify.expiry)}`;

  // Append in proper order
  details.append(name, authentic, category, expiry);
  div.append(image, details);

  return div;
}






// Fetch all products
async function fetchAllProducts() {
  try {
    const res = await fetch(`${API}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (res.ok && Array.isArray(data.verifyAll)) {
      allProduct.innerHTML = "";
      data.verifyAll.forEach((product) => {
        const card = createProductCard(product, product.authentic);
        allProduct.appendChild(card);
      });
    } else {
      console.error("Invalid response:", data);
      alert(data.message || "Could not load products");
    }
  } catch (err) {
    console.error("Error fetching products:", err);
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







//=========LOGOUT=======/
// ---------- LOGOUT: attach to all .logloglog anchors ----------
const logoutBtns = document.querySelectorAll(".logloglog");
if (logoutBtns && logoutBtns.length > 0) {
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      // redirect to your app's frontend home (use relative path)
      window.location.href = "../index.html";
    });
  });
} else {
  // no logout anchors still shouldn't break other JS
  console.warn("No logout anchors (.logloglog) found");
}



//======profile Picture=====//

async function loadUserProfile() {
  try {
    const res = await fetch(`${API}/auth/me`, {
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

    if (data.profileImage) {
      // Build a correct absolute URL (handles leading/trailing slashes safely)
      const imgUrl = new URL(data.profileImage, APP).href;
      console.log("Final profile image URL:", imgUrl);
      profilePic.src = imgUrl;

      profilePic.onerror = () => {
        console.warn("Failed to load profile image from server, using fallback.");
        profilePic.src = "../images/Ellipse 1.svg";
      };
    } else {
      console.warn("No profileImage returned from API, using fallback.");
      profilePic.src = "../images/Ellipse 1.svg";
    }
  } catch (err) {
    console.error("Profile error:", err.message);
  }
}




// ---------- AWARENESS DROPDOWN (use existing bell/dropdown) ----------
const dropbell = document.getElementById("dropbell");
const awarenessDropdown = document.createElement("div");
awarenessDropdown.classList.add("mobile-dashboard-notification", "hidden");
document.getElementById("dropdown").appendChild(awarenessDropdown);

// toggle on bell click
dropbell.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent closing immediately
  awarenessDropdown.classList.toggle("hidden");
});

// hide when clicking outside
document.addEventListener("click", (e) => {
  if (!document.getElementById("dropdown").contains(e.target)) {
    awarenessDropdown.classList.add("hidden");
  }
});

async function fetchAwareness() {
  try {
    const res = await fetch(`${API}/awareness?page=1&limit=4`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log("Awareness Response:", data);
    if (!res.ok) throw new Error(data.message || "Failed to load awareness");

    const awarenessList = data.awareNess || [];
    awarenessDropdown.innerHTML = "";

    if (awarenessList.length === 0) {
      awarenessDropdown.innerHTML = `<p>No awareness alerts found</p>`;
      return;
    }

    awarenessList.forEach((a) => {
      const item = document.createElement("div");
      item.classList.add("notification-default");

      // safe image url builder
      const imgSrc = a.image ? new URL(a.image, APP).href : "../images/profile-female.svg";

      item.innerHTML = `
        <img class="notification-default-child" src="${imgSrc}" alt="awareness" />
        <div class="mobile-dashboard-notification-frame-parent">
          <div class="miss-jennifer-parent">
            <div class="miss-jennifer">${a.title}</div>
            <div class="view-wrapper"><div class="view">View</div></div>
          </div>
          <div class="fake-product-everywhere">${a.description || "No description"}</div>
          <div class="m-ago">${new Date(a.createdAt).toLocaleDateString()}</div>
        </div>
      `;
      awarenessDropdown.appendChild(item);
    });
  } catch (err) {
    console.error("Awareness error:", err.message);
  }
}


// Load when page starts
document.addEventListener("DOMContentLoaded", () => {
  fetchDashboardStats();
  fetchAllProducts();
  loadUserProfile();
  fetchAwareness();
  formatDate();
});