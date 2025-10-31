//analytics.js

//const API = 'http://localhost:5000/api'; // Local backend
  const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
  const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

  // ================= USER ROLE CHECK =================
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  let categoryChart;

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




// Product Category & counterfeit Products

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
  const label = document.querySelectorAll(`.${id}P`);
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
const drugsP = document.querySelectorAll('.drugsP');
const beveragesP = document.querySelectorAll('.beveragesP');
const cosmeticsP = document.querySelectorAll('.cosmeticsP');
const chemicalsP = document.querySelectorAll('.chemicalsP'); 
const devicesP = document.querySelectorAll('.devicesP');
const totalUsers2 = document.querySelectorAll(".totalUsers2");

// counterfeit %
const drugsP2 = document.querySelectorAll('.drugsP2');
const beveragesP2 = document.querySelectorAll('.beveragesP2');
const cosmeticsP2 = document.querySelectorAll('.cosmeticsP2');
const chemicalsP2 = document.querySelectorAll('.chemicalsP2'); 
const devicesP2 = document.querySelectorAll('.devicesP2');

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
    totalUsers2.forEach(el => el.textContent = data.totalReportedProducts);


    const cat = data.categoryData || {};

    // Percentages
    const drugs = cat.drugs?.percent || 0;
    const beverages = cat.beverages?.percent || 0;
    const cosmetics = cat.cosmetics?.percent || 0;
    const chemicals = cat.chemical?.percent || 0; 
    const devices = cat.devices?.percent || 0; 

    // percentage cunterfeits
    const cat2 = data.counterfeitData || {};

    const drugs2 = cat2.drugs?.percent || 0;
    const beverages2 = cat2.beverages?.percent || 0;
    const cosmetics2 = cat2.cosmetics?.percent || 0;
    const chemicals2 = cat2.chemical?.percent || 0; 
    const devices2 = cat2.devices?.percent || 0; 

    // Update the text and animate bars
    updateCategoryBar("drugs", drugs);
    updateCategoryBar("beverages", beverages);
    updateCategoryBar("cosmetics", cosmetics);
    updateCategoryBar("chemicals", chemicals);
    updateCategoryBar("devices", devices);

    // Get percentage for each category
    beveragesP.forEach(el => el.textContent = `${beverages}%`);
    drugsP.forEach(el => el.textContent = `${drugs}%`);
    cosmeticsP.forEach(el => el.textContent = `${cosmetics}%`);
    chemicalsP.forEach(el => el.textContent = `${chemicals}%`);
    devicesP.forEach(el => el.textContent = `${devices}%`);

    //counterfeit %
    beveragesP2.forEach(el => el.textContent = `${beverages2}%`);
    drugsP2.forEach(el => el.textContent = `${drugs2}%`);
    cosmeticsP2.forEach(el => el.textContent = `${cosmetics2}%`);
    chemicalsP2.forEach(el => el.textContent = `${chemicals2}%`);
    devicesP2.forEach(el => el.textContent = `${devices2}%`);


    // Prepare labels and data for the chart
    const labels = ["Drugs", "Devices", "Beverages", "Cosmetics", "Chemicals"];
    const dataValues = [drugs2, devices2, beverages2, cosmetics2, chemicals2];

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

// ---------- initialize ----------
loadUserProfile();
fetchAwareness();


fetchDashboardStats();
loadCategory();
