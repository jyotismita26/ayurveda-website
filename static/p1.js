
const plantModal = document.getElementById("modal");
const plantCloseBtn = document.querySelector(".plant-close");
const infoModalLinks = document.querySelectorAll(".open-popup-link");
const allModals = document.querySelectorAll(".modal"); 
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const searchInput = document.querySelector(".nav-search input");
const searchButton = document.querySelector(".nav-search button");
const shopSection = document.querySelector(".shop-section");
// Save the initial shop section HTML so we can restore it after searches
const initialShopHTML = shopSection ? shopSection.innerHTML : "";

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

function closePlantModal() {
  plantModal.style.display = "none";
  document.getElementById("plant-model").src = ""; 
  document.body.style.overflow = "auto"; 
}

if (plantCloseBtn) {
  plantCloseBtn.addEventListener("click", closePlantModal);
}



function closeAllModals() {
  allModals.forEach(m => m.style.display = "none");
  document.getElementById("plant-model").src = "";
  document.body.style.overflow = "auto"; 
}

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

document.querySelectorAll(".info-close").forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;

  fetch(`/api/search?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      shopSection.innerHTML = ""; 

      if (data.length === 0) {
        shopSection.innerHTML = "<p>No plants found.</p>";
        return;
      }

      data.forEach(plant => {
        const box = document.createElement("div");
        box.classList.add("box");

        box.dataset.name = plant.name;
        box.dataset.info = plant.info || "No information available.";
        box.dataset.advantages = plant.advantages || "Not available.";
        box.dataset.disadvantages = plant.disadvantages || "Not available.";
        box.dataset.uses = plant.uses || "Not available.";
        box.dataset.benefits = plant.benefits || "Not available.";
        box.dataset.model = plant.model || "";

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

shopSection.addEventListener("click", (e) => {
  const box = e.target.closest(".box");
  if (!box) return;
  openPlantModal(box);
});

// Intercept navigation links in the header that point to in-page anchors
// and perform a smooth scroll instead of letting the browser jump/refresh.
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
  // don't override modal/open-popup links which use data-modal-id
  if (link.classList.contains('open-popup-link')) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const hash = link.getAttribute('href');

    // If user clicks Home, restore the original shop content (undo search)
    if (hash === '#home-section' && shopSection) {
      // close any open modals
      try { closeAllModals(); } catch (e) {}
      // restore initial content and clear search input
      shopSection.innerHTML = initialShopHTML;
      if (searchInput) searchInput.value = '';
    }

    try {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

 const toggleBtn = document.getElementById("chat-toggle");
    const chatbot = document.getElementById("chatbot");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-body");

    toggleBtn.addEventListener("click", () => {
      chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
    });

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", e => {
      if (e.key === "Enter") sendMessage();
    });

    function appendMessage(content, className) {
      const msg = document.createElement("div");
      msg.classList.add("chat-message", className);
      msg.textContent = content;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function sendMessage() {
      const text = userInput.value.trim();
      if (!text) return;
      appendMessage(text, "user-msg");
      userInput.value = "";

      appendMessage("Thinking...", "bot-msg");

      const response = await fetch("/ask", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      const botMessages = document.querySelectorAll(".bot-msg");
      botMessages[botMessages.length - 1].remove();

      appendMessage(data.reply, "bot-msg");
    }

