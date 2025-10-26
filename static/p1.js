// -----------------------------
// Element selectors
// -----------------------------
const plantModal = document.getElementById("modal");
const plantCloseBtn = document.querySelector(".plant-close");
const plantBoxes = document.querySelectorAll(".box");

const infoModalLinks = document.querySelectorAll(".open-popup-link");
const allModals = document.querySelectorAll(".modal"); 

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

const searchInput = document.querySelector(".nav-search input");
const searchButton = document.querySelector(".nav-search button");
const shopSection = document.querySelector(".shop-section");

// -----------------------------
// Open plant modal
// -----------------------------
function openPlantModal(box) {
    document.getElementById("plant-name").innerText = box.dataset.name;
    document.getElementById("plant-info").innerText = box.dataset.info;
    document.getElementById("plant-advantages").innerText = box.dataset.advantages;
    document.getElementById("plant-disadvantages").innerText = box.dataset.disadvantages;
    document.getElementById("plant-uses").innerText = box.dataset.uses;
    document.getElementById("plant-benefits").innerText = box.dataset.benefits;
    
    const plantModelIframe = document.getElementById("plant-model");
    plantModelIframe.src = box.dataset.model;
    
    plantModal.style.display = "block";
    document.body.style.overflow = "hidden";
}

// -----------------------------
// Close plant modal
// -----------------------------
function closePlantModal() {
    plantModal.style.display = "none";
    document.getElementById("plant-model").src = ""; 
    document.body.style.overflow = "auto"; 
}

// Attach click events for initial boxes
plantBoxes.forEach(box => {
    box.addEventListener("click", () => {
        openPlantModal(box);
    });
});

// Close button for modal
if (plantCloseBtn) {
    plantCloseBtn.addEventListener("click", closePlantModal);
}

// -----------------------------
// Close all modals
// -----------------------------
function closeAllModals() {
    allModals.forEach(m => {
        m.style.display = "none";
    });
    document.getElementById("plant-model").src = "";
    document.body.style.overflow = "auto"; 
}

// Info modals
infoModalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); 
        navLinks.classList.remove("active"); 
        const modalId = link.dataset.modalId;
        const targetModal = document.getElementById(modalId);
        if (targetModal) {
            closeAllModals(); 
            targetModal.style.display = 'block';
            document.body.style.overflow = "hidden";
        }
    });
});

// Close info modals
document.querySelectorAll(".info-close").forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

// Hamburger toggle
if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}
// -----------------------------
// Search functionality
// -----------------------------
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            shopSection.innerHTML = ""; // clear previous results

            if (data.length === 0) {
                shopSection.innerHTML = "<p>No plants found.</p>";
                return;
            }

            data.forEach(plant => {
                const box = document.createElement("div");
                box.classList.add("box");

                // Set data attributes for modal
                box.dataset.name = plant.name;
                box.dataset.info = plant.info || "No information available.";
                box.dataset.advantages = plant.advantages || "Not available.";
                box.dataset.disadvantages = plant.disadvantages || "Not available.";
                box.dataset.uses = plant.uses || "Not available.";
                box.dataset.benefits = plant.benefits || "Not available.";
                box.dataset.model = plant.model || "";

                // Inner HTML
                box.innerHTML = `
                    <h2>${plant.name}</h2>
                    <img src="${plant.image}" width="100%" height="200">
                    <p>Quick View</p>
                `;

                shopSection.appendChild(box);
            });
        })
        .catch(err => {
            console.error("Error fetching plants:", err);
            shopSection.innerHTML = "<p>Error fetching data.</p>";
        });
});

// -----------------------------
// Event delegation for Quick View
// -----------------------------
shopSection.addEventListener("click", (e) => {
    const box = e.target.closest(".box");
    if (!box) return;
    openPlantModal(box);
});
