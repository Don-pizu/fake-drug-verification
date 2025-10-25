//verify-product.js


document.addEventListener("DOMContentLoaded", () => {
// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing
//const APP = 'http://localhost:5000';

const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

const token = localStorage.getItem("token");

const vfyContainer = document.getElementById("vfy-container");

/* if (!token) window.location.href = "index.html"; */


// FORM VERIFY (manual input)
document
  .getElementById("verifyBtn")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    console.log("Form submitted");
    const nafdacReg = document.getElementById("nafdac-number").value.trim();

    if (!nafdacReg) {
      alert("Nafdac number is required");
      return;
    }

    try {
      const res = await fetch(`${API}/verify/${nafdacReg}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        buildVerificationModal(data);
      } else {
        alert(data.message || "Nafdac Reg is invalid");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  });



// ---------------------------
// OCR SCAN (Frontend using Tesseract.js)
// ---------------------------

const cameraBtn = document.getElementById("cameraBtn");
const ocrInput = document.getElementById("ocr-input");
const ocrResult = document.getElementById("ocr-result");

if (cameraBtn && ocrInput) {
  cameraBtn.addEventListener("click", () => ocrInput.click());

  ocrInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    ocrResult.innerText = "⏳ Scanning image... Please wait";

    Tesseract.recognize(file, "eng", {
      logger: (info) => console.log(info),
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-", // ✅ allow only alphanumeric + dash
    })
      .then(({ data: { text } }) => {
        console.log("OCR raw text:", text);

         // Clean up the text
        const cleaned = text.replace(/\s+/g, "").trim();
        console.log(" Cleaned text:", cleaned);

        // Try to match NAFDAC Reg number (digits, adjust regex if format includes letters)
        const match = text.match(/[A-Za-z0-9\-]{4,}/);       // to allow other character /[A-Za-z0-9\-\_\%\@]{4,}/

        if (match) {
          const nafdacReg = match[0].trim();
          ocrResult.innerText = `✅ Extracted: ${nafdacReg}`;

          // Autofill input field
          document.getElementById("nafdac-number").value = nafdacReg;

          // Automatically call verify endpoint
          fetch(`${API}/verify/${nafdacReg}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.name) {

                // Reuse the same modal builder
                buildVerificationModal(data);
               // ocrResult.innerText += "\n✔ Verified: " + data.name;
              } else {
                //ocrResult.innerText += "\n❌ Not Found in Database";
                alert("❌ Nafdac Reg not found in database");
              }
            })
            .catch((err) => {
              ocrResult.innerText += "\n⚠ Verification error";
              console.error(err);
            });
        } else {
          ocrResult.innerText = "❌ No valid NAFDAC number found in image";
        }
      })
      .catch((err) => {
        ocrResult.innerText = "⚠ OCR failed. Try again.";
        console.error(err);
      });
  });
}



function buildVerificationModal(data) {
  vfyContainer.innerHTML = "";

  const overlay = document.createElement("div");
  overlay.classList.add("vfy-overlay");

  const modal = document.createElement("div");
  modal.classList.add("vfy-modal", "vfy-active");

  modal.innerHTML = `
    <div class="vfy-header">
      <span>Verification Result</span>
      <button id="vfy-close">&times;</button>
    </div>
    <div class="vfy-body">
      <img src="${data.image}" alt="${data.name}">


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

});
