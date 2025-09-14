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

// Call it
fetchAll();

// Load when page starts
document.addEventListener("DOMContentLoaded", fetchDashboardStats);
