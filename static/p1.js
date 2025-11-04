
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
      
      // Safely set the content
      const textNode = document.createTextNode(content);
      msg.appendChild(textNode);
      
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function sendMessage() {
      const text = userInput.value.trim();
      if (!text) return;
      
      // Disable input and button while processing
      userInput.disabled = true;
      sendBtn.disabled = true;
      
      // Clear input and show user message
      userInput.value = "";
      appendMessage(text, "user-msg");

      // Show thinking message
      const thinkingMsg = document.createElement("div");
      thinkingMsg.classList.add("chat-message", "bot-msg", "thinking");
      thinkingMsg.innerHTML = `
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>`;
      chatBody.appendChild(thinkingMsg);
      chatBody.scrollTop = chatBody.scrollHeight;

      try {
        console.log("Sending message to server:", text);  // Debug log
        const response = await fetch("/chat", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ message: text })
        });

        console.log("Server response status:", response.status);  // Debug log
        
        const data = await response.json();
        console.log("Server response data:", data);  // Debug log
        
        // Remove thinking message
        thinkingMsg.remove();
        
        if (response.ok && data.reply) {
          appendMessage(data.reply, "bot-msg");
        } else {
          throw new Error(data.reply || "No response from server");
        }
      } catch (error) {
        console.error("Chat error:", error);
        // Remove thinking message
        thinkingMsg.remove();
        // Show error message to user
        appendMessage(
          "I'm having trouble connecting to the AI. Please check your API key and try again.", 
          "bot-msg error"
        );
      } finally {
        // Re-enable input and button
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
      }
    }

