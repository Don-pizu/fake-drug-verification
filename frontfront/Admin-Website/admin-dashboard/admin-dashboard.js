// admin-dashboard.js

//const API = 'http://localhost:5000/api'; // Local backend
//const APP = 'http://localhost:5000';

const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

  // ================= USER ROLE CHECK =================
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

let categoryChart;
  if (!token) {
    // redirect to login if no token
    window.location.href = "https://fake-drug-verification.onrender.com";
  }
  if (userRole !== "admin") {
    alert("You are not an admin");
    window.location.href = "https://fake-drug-verification.onrender.com";
  }
  



// Elements

const productList = document.getElementById("productTableBody");
const totalProVeri = document.getElementById("totalProduct");
const totalReport = document.getElementById("totalReport");
const totalAwareness = document.getElementById("totalAwareness");
const totalUser = document.getElementById("totalUsers");

const PercenttotalProVeri = document.getElementById("percent-totalProduct");
const PercenttotalReport = document.getElementById("percent-totalReport");
const PercenttotalAwareness = document.getElementById("percent-totalAwareness");
const PercenttotalUser = document.getElementById("percent-totalUsers");

// Fetch all verify records
async function fetchProducts() {
  try {
    const res = await fetch(`${API}/verify`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // backend ignores if not protected
      },
    });

    const data = await res.json();

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


// Fetch stats
async function fetchStats() {
  try {
    const res = await fetch(`${API}/stats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
  

    if (!res.ok) throw new Error(data.message || "Failed to fetch stats");

    // Some backends wrap stats inside { stats: {...} }
    const stats = data.stats || data;

    

     // Assign values
    totalProVeri.textContent = data.totalVerifiedProducts || 0;
    totalReport.textContent = data.reportCount || 0;
    totalAwareness.textContent = data.awarenessCount || 0;
    totalUser.textContent = data.userCount || 0;

    // Assign percentages
    PercenttotalProVeri.textContent = `${data.percentVerifiedProducts || 0}% from last month`;
    PercenttotalReport.textContent = `${data.percentReport || 0}% this month`;
    PercenttotalAwareness.textContent = `${data.percentAwareness || 0}% new alerts`;
    PercenttotalUser.textContent = `${data.percentUsers || 0}% new users`;


  } catch (err) {
    console.error("Stats Error:", err.message);
  }
}



//=====funstion for loading %
function showLoadingBars() {
  document.querySelectorAll(".loading-bar").forEach((bar) => {
    bar.style.opacity = "1"; // make shimmer visible
  });
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.width = "0"; // reset actual bars
  });
}

// ===== Function to hide shimmer =====
function hideLoadingBars() {
  document.querySelectorAll(".loading-bar").forEach((bar) => {
    bar.style.opacity = "0"; // fade shimmer out
  });
}


//Bar loading for the categories
function updateCategoryBar(id, percent) {
  const bar = document.getElementById(`${id}Bar`);
  const label = document.getElementById(`${id}P`);
  if (!bar || !label) return;

  // Convert to number safely
  const safePercent = parseFloat(percent) || 0;

  // Clamp values between 0–100 (no overflow)
  const finalPercent = Math.min(Math.max(safePercent, 0), 100);

  // Update bar + text
  bar.style.width = `${finalPercent}%`;
  label.textContent = `${finalPercent.toFixed(1)}%`;
}

//categories loading and %
const drugsP = document.getElementById('drugsP');
const beveragesP = document.getElementById('beveragesP');
const cosmeticsP = document.getElementById('cosmeticsP');
const chemicalsP = document.getElementById('chemicalsP'); 
const devicesP = document.getElementById('devicesP');
const totalUsers2 = document.getElementById("totalUsers2");

async function loadCategory() {
  showLoadingBars(); // show the helper bars

  try {
    const res = await fetch(`${API}/stats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch stats");

    // total users
    totalUsers2.textContent = data.userCount;
  
    const cat = data.categoryData || {};

    // Percentages
    const drugs = cat.drugs?.percent || 0;
    const beverages = cat.beverages?.percent || 0;
    const cosmetics = cat.cosmetics?.percent || 0;
    const chemicals = cat.chemical?.percent || 0; 
    const devices = cat.devices?.percent || 0;    

    // Update the text and animate bars
    updateCategoryBar("drugs", drugs);
    updateCategoryBar("beverages", beverages);
    updateCategoryBar("cosmetics", cosmetics);
    updateCategoryBar("chemicals", chemicals);
    updateCategoryBar("devices", devices);

    // Get percentage for each category
    beveragesP.textContent = `${beverages}%`;
    drugsP.textContent = `${drugs}%`;
    cosmeticsP.textContent = `${cosmetics}%`;
    chemicalsP.textContent = `${chemicals}%`;
    devicesP.textContent = `${devices}%`;


    // Prepare labels and data for the chart
    const labels = ["Drugs", "Devices", "Beverages", "Cosmetics", "Chemicals"];
    const dataValues = [drugs, devices, beverages, cosmetics, chemicals];

    // Call the update function
    updateCategoryChart(labels, dataValues);



     // Delay fade out for smooth transition
    setTimeout(hideLoadingBars, 800);
    
  } catch (err) {
    console.error("Error loading stats:", err);
  }
}


function updateCategoryChart(labels, data) {
  const ctx = document.getElementById('myDoughnut').getContext('2d');

  // Destroy previous chart (if it exists)
  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#00C503', '#4DFA72', '#006304',
          '#F44336', '#B24C00'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'bottom',
          labels: { color: '#333', boxWidth: 15 }
        }
      },
      cutout: '70%'
    }
  });
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
      profilePic.src = data.profileImage;

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
awarenessDropdown.classList.add("notification", "hidden");
document.getElementById("dropdown").appendChild(awarenessDropdown);

// toggle on bell click
dropbell.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent closing immediately
  awarenessDropdown.classList.toggle("hidden");
});

// hide only when clicking completely outside (not inside dropdown)
document.addEventListener("click", (e) => {
  if (
    !document.getElementById("dropdown").contains(e.target) &&
    !awarenessDropdown.contains(e.target)
  ) {
    awarenessDropdown.classList.add("hidden");
  }
});


// prevent dropdown from closing when scrolling or clicking inside
awarenessDropdown.addEventListener("click", (e) => {
  e.stopPropagation();
});
awarenessDropdown.addEventListener("scroll", (e) => {
  e.stopPropagation();
});


async function fetchAwareness() {
  try {
    const res = await fetch(`${API}/awareness?page=1&limit=4`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load awareness");

    const awarenessList = data.awareNess || [];
    awarenessDropdown.innerHTML = "";

    if (awarenessList.length === 0) {
      awarenessDropdown.innerHTML = `<p>No awareness alerts found</p>`;
      return;
    }

    awarenessList.forEach((a) => {
      const item = document.createElement("div");
      item.classList.add("item");

      // safe image url builder
      const imgSrc = "../images/user.svg";

      item.innerHTML = `
        <img src="${imgSrc}" alt="awareness" />
        <div class="info">
          
          <h5>${a.title}</h5>
          <p>${a.description || "No description"}</p>
          <span>${new Date(a.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' } )}</span>
        </div>
         <a href="https://fake-drug-verification.onrender.com/">View</a>
      `;
      awarenessDropdown.appendChild(item);
    });
  } catch (err) {
    console.error("Awareness error:", err.message);
  }
}





// Initial load
fetchProducts();
fetchStats();
loadUserProfile();
fetchAwareness();
loadCategory();
