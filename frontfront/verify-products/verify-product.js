//verify-product.js

// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend

const token = localStorage.getItem('token');

const vfyContainer = document.getElementById('vfy-container');

if(!token)
	window.location.href = "../index/index.html";

document.querySelector('.verification-form').addEventListener('submit', async (e) => {
	e.preventDefault();

	const nafdacReg = document.getElementById('nafdac-number').value.trim();

	if (!nafdacReg) {
		alert('Nafdac number is required');
		return;
	}

	try {
		const res = await fetch(`${API}/verify/${nafdacReg}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		const data = await res.json();

		if (res.ok) {
	      // Clear previous modal
	      vfyContainer.innerHTML = "";

	      // Create overlay
	      const overlay = document.createElement("div");
	      overlay.classList.add("vfy-overlay");

	      // Create modal
	      const modal = document.createElement("div");
	      modal.classList.add("vfy-modal", "vfy-active");

	      modal.innerHTML = `
	        <div class="vfy-header">
	          <span>Verification Result</span>
	          <button id="vfy-close">&times;</button>
	        </div>
	        <div class="vfy-body">
	          <img src="${data.image ? `http://localhost:5000${data.image}` : "../assets/images/default.png"}" alt="${data.name}">
	          <h2 class="vfy-name">${data.name}</h2>
	          <span class="vfy-badge ${data.authentic ? "vfy-authentic" : "vfy-counterfeit"}">
	            ${data.authentic ? "✔ Authentic" : "⚠ Counterfeit"}
	          </span>
	          <p class="vfy-line">Category: ${data.category || "N/A"}</p>
	          <p class="vfy-line"><strong>Reg. No:</strong> ${data.nafdacReg}</p>
	          <p class="vfy-line"><strong>Expired:</strong> ${data.expiry || "N/A"}</p>
	          <button class="vfy-done" id="vfy-done">Done</button>
	          <div class="vfy-safety">
	            <strong>⚠ Safety Reminder</strong>
	            Always verify a product before using it on your body.
	            Fake or unapproved items can cause serious harm. Use only trusted sources.
	          </div>
	        </div>
	      `;

	      vfyContainer.appendChild(overlay);
	      vfyContainer.appendChild(modal);

	      // Close handlers
	      document.getElementById("vfy-close").addEventListener("click", () => {
	        overlay.remove();
	        modal.remove();
	      });
	      document.getElementById("vfy-done").addEventListener("click", () => {
	        overlay.remove();
	        modal.remove();
	      });
	      overlay.addEventListener("click", () => {
	        overlay.remove();
	        modal.remove();
	      });

			
		} else {
			alert(data.message || 'Nafdac Reg is invalid')
		}


	} catch (err) {
		alert("Something went wrong. Please try again.");
	    console.error(err);
	}

});


