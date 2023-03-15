function createCard(medicine, temperature, notes, timestamp) {
    const newCard = document.createElement("div");
    newCard.className = "medicine-card";
  
    newCard.innerHTML = `
      <button class="delete-button">Delete</button>
      <h3>${medicine}</h3>
      <button class="edit-button">Edit</button>
      <p><strong>Temperature:</strong> <span>${temperature}°F</span></p>
      <p><strong>Timestamp:</strong> ${timestamp}</p>
      <p><strong>Notes:</strong> <span>${notes}</span></p>
    `;
  
    newCard.querySelector(".delete-button").onclick = function () {
      newCard.remove();
      saveCardsToLocalStorage();
    };
  
    newCard.querySelector(".edit-button").onclick = function () {
      newCard.querySelectorAll("h3, span").forEach(function (element) {
        element.contentEditable = !element.isContentEditable;
      });
  
      this.textContent = this.textContent === "Edit" ? "Save" : "Edit";
    };
  
    return newCard;
  }
  
  function saveCardsToLocalStorage() {
    const cardsData = Array.from(document.querySelectorAll(".medicine-card")).map(function (card) {
      return {
        medicine: card.querySelector("h3").textContent,
        temperature: card.querySelector("p > span").textContent,
        notes: card.querySelector("p > strong + span").textContent,
        timestamp: card.querySelector("strong + strong + strong").nextSibling.textContent.trim(),
      };
    });
  
    localStorage.setItem("medicineCards", JSON.stringify(cardsData));
  }
  
  function loadCardsFromLocalStorage() {
    const cardsData = JSON.parse(localStorage.getItem("medicineCards"));
  
    if (cardsData) {
      cardsData.forEach(function (cardData) {
        const card = createCard(cardData.medicine, cardData.temperature, cardData.notes, cardData.timestamp);
        document.getElementById("medicine-cards").appendChild(card);
      });
    }
  }
  
  document.getElementById("medicine-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const medicine = document.getElementById("medicine").value;
    const temperature = document.getElementById("temperature").value;
    const notes = document.getElementById("notes").value;
  
    if (!medicine || !temperature) {
      alert("Please fill in all required fields");
      return;
    }
  
    const timestamp = new Date().toLocaleString();
    const newCard = createCard(medicine, temperature, notes, timestamp);
    document.getElementById("medicine-cards").appendChild(newCard);
  
    saveCardsToLocalStorage();
  
    document.getElementById("temperature").value = "";
    document.getElementById("notes").value = "";
  });
  
  loadCardsFromLocalStorage();