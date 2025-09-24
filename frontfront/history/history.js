// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

const token = localStorage.getItem("token");

if (!token) {
  // redirect to login if no token
  window.location.href = "../index.html";
}

const productList = document.getElementById("productTableBody");
const beverages = document.getElementById("beverages");
const drugs = document.getElementById("drugs");
const cosmetics = document.getElementById("cosmetics");
const chemical = document.getElementById("chemical");
const devices = document.getElementById("devices")
const totalProduct = document.getElementById("totalProduct");

// Fetch all verify records
async function fetchProducts() {
  try {
    const res = await fetch(`${API}/verify`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });

    const data = await res.json();
    console.log("API Response:", data);

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
    console.error("Error:", err.message);
    productList.innerHTML = `
      <tr><td colspan="5">⚠️ ${err.message}</td></tr>
    `;
  }
}

// Render products
function renderProducts(products) {
  if (!productList) return;

  productList.innerHTML = "";

  products.forEach((p) => {
    const row = document.createElement("tr");

    // Format expiry/created date (DD/MM/YYYY)
    const date = p.expiryDate
      ? new Date(p.expiryDate).toLocaleDateString("en-GB") // example: 26/05/2026
      : p.createdAt
      ? new Date(p.createdAt).toLocaleDateString("en-GB")
      : "N/A";
    
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
        <td>${date}</td>
    `;

    productList.appendChild(row);
  });
}






function updateDonut(id, percentage) {
  const donut = document.getElementById(id);
  if (donut) {
    donut.style.background = `conic-gradient(
      green 0% ${percentage}%,
      red ${percentage}% 100%
    )`;
    donut.innerHTML = `<p>${percentage}%</p>`;
  }
}



// Get verify product categories in %
async function getCounts() {
  try {
    const res = await fetch(`${API}/verifyStats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Stats Response:", data);

    // Cosmetic
    updateDonut("cosmetic", data.cosmetics.percentage);

    // Beverages
    updateDonut("beverages", data.beverages.percentage);

    // Chemical
    updateDonut("chemical", data.chemical.percentage);

    // Drugs
    updateDonut("drugs", data.drugs.percentage);

    // Devices
    updateDonut("devices", data.devices.percentage);

     // Totals
    const total = data.totalProducts || 0;
    const verified = data.totalVerified || 0;
    const reported = data.totalReported || 0;
    const percentage = data.totalPercentage || 0;

    // Update donut for totals
    updateDonut("totalProduct", percentage);

    document.getElementById("totalProduct").innerHTML = `<p>${total}</p>`;
    document.getElementById("totalVerified").textContent = `${verified} Verified`;
    document.getElementById("totalReported").textContent = `${reported} Reported`;

  } catch (err) {
    console.error("Error fetching stats:", err.message);
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

// ---------- initialize ----------
loadUserProfile();
fetchAwareness();


// Initial load
fetchProducts();
