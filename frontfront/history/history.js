// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend


const token = localStorage.getItem("token");

if (!token) {
  // redirect to login if no token
  window.location.href = "../index/index.html";
}

const productList = document.getElementById("productTableBody");

// Fetch all verify records
async function fetchProducts() {
  try {
    const res = await fetch(`${API}/verify`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // backend ignores this if not protected
      }
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
  productList.innerHTML = "";

  products.forEach((p) => {
    const row = document.createElement("tr");
    row.classList.add("product-row");

    row.innerHTML = `
      <td>${p.name || "Unnamed"}</td>
      <td>
        <span class="status-badge ${p.authentic ? "status-auth" : "status-fake"}">
          ${p.authentic ? "✅ Authentic" : "❌ Fake"}
        </span>
      </td>
      <td>${p.category || "N/A"}</td>
      <td>${p.nafdacReg || "N/A"}</td>
      <td>${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}</td>
    `;

    productList.appendChild(row);
  });
}

// Initial load
fetchProducts();
