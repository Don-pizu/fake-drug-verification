// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend

const token = localStorage.getItem('token');

if(!token)
	window.location.href = "../index/index.html";

const recentPro = document.getElementById('recentPro');
const approvedPro = document.getElementById('approvedPro');
const fakePro = document.getElementById('fakePro');



// Helper to render product card
function createProductCard(verify, isApproved) {
  const div = document.createElement('div');
  div.classList.add('product-card');

  const image = document.createElement('img');
  image.src = verify.image ? `${api}${verify.image}` : 'images/placeholder.png';
  image.alt = verify.name;
  image.classList.add('product-image');

  const name = document.createElement('h4');
  name.textContent = verify.name;

  const authentic = document.createElement('span');
  authentic.textContent = verify.authentic ? "✅ Verified" : "❌ Fake";
  authentic.classList.add('product-badge', isApproved ? 'badge-approved' : 'badge-fake');

  const category = document.createElement('p');
  category.textContent = `Category: ${verify.category}`;

  const expiry = document.createElement('p');
  expiry.textContent = `Expiry: ${verify.expiry}`;

  div.appendChild(image);
  div.appendChild(name);
  div.appendChild(authentic);
  div.appendChild(category);
  div.appendChild(expiry);

  return div;
}


// Fetch recent products
async function fetchRecent() {
  const res = await fetch(`${API}/verify?limit=4`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  if (res.ok && Array.isArray(data.verifyAll)) {
    recentPro.innerHTML = "";
    data.verifyAll.forEach(product => {
      const card = createProductCard(product, product.authentic);
      recentPro.appendChild(card);
    });
  } else {
    console.error("Invalid response:", data);
    alert(data.message || 'Could not load recent products');
  }
}





// Fetch verified drugs
async function fetchVerified() {
  const res = await fetch(`${API}/verify?authentic=true&limit=4`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  if (res.ok && Array.isArray(data.verifyAll)) {
    approvedPro.innerHTML = "";
    data.verifyAll.forEach(verify => {
      const card = createProductCard(verify, true);
      approvedPro.appendChild(card);
    });
  } else {
    console.error("Invalid response:", data);
  	alert(data.message || 'Nafdac Reg is invalid');
  }
}

// Fetch counterfeit drugs
async function fetchCounterfeit() {
  const res = await fetch(`${API}/verify?authentic=false&limit=4`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  if (res.ok && Array.isArray(data.verifyAll)) {
    fakePro.innerHTML = "";
    data.verifyAll.forEach(verify => {
      const card = createProductCard(verify, false);
      fakePro.appendChild(card);
    });
  } else {
  	console.error("Invalid response:", data);
    alert(data.message || 'Nafdac Reg is invalid');
  }
}

// Call them when page loads
fetchRecent();
fetchVerified();
fetchCounterfeit();