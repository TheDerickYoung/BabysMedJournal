//form to populate when there is no details of the users baby stored in local storage already 
function createBabyInfoForm() {
    const form = document.createElement("form");
    form.id = "baby-info-form";
  
    form.innerHTML = `
      <label for="baby-name">Baby's Name:</label>
      <input type="text" id="baby-name" name="baby-name" placeholder="Enter baby's name" />
  
      <label for="baby-age">Baby's Age (Months):</label>
      <input type="number" id="baby-age" name="baby-age" min="0" step="1" placeholder="Enter baby's age in months" />
  
      <label for="baby-weight">Baby's Weight (lbs):</label>
      <input type="number" id="baby-weight" name="baby-weight" min="0" step="0.1" placeholder="Enter baby's weight in pounds" />
  
      <button type="submit">Save Baby Information</button>
    `;
  
    return form;
  }

  //function to save the baby's info in local storage
  function saveBabyInfoToLocalStorage(name, age, weight) {
    const babyInfo = {
      name: name,
      age: age,
      weight: weight
    };

    localStorage.setItem("babyInfo", JSON.stringify(babyInfo));
  }

  //function to load the baby's info from local storage
  function loadBabyInfoFromLocalStorage() {
    const babyInfo = JSON.parse(localStorage.getItem("babyInfo"));
    return babyInfo;
  }

  //event listener for the baby's information form and to render it conditionally
  //event listener for the baby's information form and to render it conditionally
function initBabyInfoForm() {
  const babyInfoContainer = document.getElementById("baby-info-container");
  const babyInfo = loadBabyInfoFromLocalStorage();

  //fires only if there is not baby's info already stored in local storage
  if (!babyInfo) {
    const babyInfoForm = createBabyInfoForm();
    babyInfoContainer.appendChild(babyInfoForm);

    babyInfoForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const babyName = document.getElementById("baby-name").value;
      const babyAge = document.getElementById("baby-age").value;
      const babyWeight = document.getElementById("baby-weight").value;

      if (!babyName || !babyAge || !babyWeight) {
        alert("Please fill in all required fields");
        return;
      }

      if (/\d/.test(babyName)) {
        alert("Baby's name should not contain numbers");
        document.getElementById("baby-name").value = "";
        return;
      }

      saveBabyInfoToLocalStorage(babyName, parseInt(babyAge), parseFloat(babyWeight));
      babyInfoContainer.innerHTML = ""; // Remove the form from the DOM
    });
  }
}


  //Call the baby form functions 
  initBabyInfoForm();

  

//Regular functionality of app begins below.

//function to create a new card with the appropriate data
function createCard(medicine, temperature, notes, timestamp, babyInfo) {
  const newCard = document.createElement("div");
  newCard.className = "medicine-card";

  const tempMessage = getTemperatureMessage(parseFloat(temperature));

  newCard.innerHTML = `
    <button class="delete-button">Delete</button>
    <h3>${medicine}</h3>
    <button class="edit-button">Edit</button>
    <p><strong>${babyInfo.name}'s Temperature:</strong> <span>${temperature}°F</span></p>
    <p><strong>Temperature Message:</strong> <span class="${tempMessage.styleClass}">${tempMessage.message}</span> <a href="https://www.seattlechildrens.org/conditions/a-z/fever-0-12-months/" target="_blank" class="info-link">Learn more</a></p>
    <p><strong>Timestamp:</strong> ${timestamp}</p>
    <p><strong>Notes:</strong> <span>${notes}</span></p>
  `;

  //function to delete a card
  newCard.querySelector(".delete-button").onclick = function () {
    newCard.remove();
    saveCardsToLocalStorage();
  };

  //function that allows the user to edit only the medicine, temperature and notes section of each card
  newCard.querySelector(".edit-button").onclick = function () {
    const editableElements = [
      newCard.querySelector("h3"),
      newCard.querySelectorAll("p > strong + span")[0],
      newCard.querySelector("p:last-child > span"),
    ];

    editableElements.forEach(function (element) {
      element.contentEditable = element.contentEditable === "true" ? "false" : "true";
    });

    this.textContent = this.textContent === "Edit" ? "Save" : "Edit";
  };

  return newCard;
}
  
  //function that decides which temperature message to display in the DOM
  function getTemperatureMessage(temperature) {
    if (temperature >= 100 && temperature <= 102) {
      return {
        message: "Low grade fever: helpful, good range. Don't treat.",
        styleClass: "temp-low"
      };
    } else if (temperature > 102 && temperature <= 104) {
      return {
        message: "Average fever: helpful. Treat if causes discomfort.",
        styleClass: "temp-average"
      };
    } else if (temperature > 104 && temperature <= 106) {
      return {
        message: "High fever: causes discomfort, but harmless. Always treat.",
        styleClass: "temp-high"
      };
    } else if (temperature > 106 && temperature <= 108) {
      return {
        message: "Very high fever: important to bring it down. Rare to go this high.",
        styleClass: "temp-very-high"
      };
    } else if (temperature > 108) {
      return {
        message: "Dangerous fever: fever itself can be harmful.",
        styleClass: "temp-dangerous"
      };
    } else {
      return {
        message: "Temperature is in a normal range.",
        styleClass: "temp-normal"
      };
    }
  }
  
  //pretty self-explanatory here
  function saveCardsToLocalStorage() {
    const cardsData = Array.from(document.querySelectorAll(".medicine-card")).map(function (card) {
      return {
        medicine: card.querySelector("h3").textContent,
        temperature: card.querySelector("p > strong + span").textContent,
        notes: card.querySelector("p:last-child > strong + span").textContent,
        timestamp: card.querySelectorAll("p")[2].textContent.split(": ")[1],
      };
    });
  
    localStorage.setItem("medicineCards", JSON.stringify(cardsData));
  }  
  
   //pretty self-explanatory here
  function loadCardsFromLocalStorage() {
  const cardsData = JSON.parse(localStorage.getItem("medicineCards"));

  if (cardsData) {
    const babyInfo = loadBabyInfoFromLocalStorage(); // Get babyInfo from localStorage
    cardsData.forEach(function (cardData) {
      const card = createCard(cardData.medicine, parseFloat(cardData.temperature), cardData.notes, cardData.timestamp, babyInfo);
      document.getElementById("medicine-cards").appendChild(card);
    });
  }
}
  

  //event listener to create new card and save to local storage
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
    const babyInfo = loadBabyInfoFromLocalStorage();
    const newCard = createCard(medicine, temperature, notes, timestamp, babyInfo);
    document.getElementById("medicine-cards").appendChild(newCard);
  
    saveCardsToLocalStorage();
  
    document.getElementById("temperature").value = "";
    document.getElementById("notes").value = "";
  });
  
  //pretty self explanatory again
  loadCardsFromLocalStorage();

//add feature that allows users to search through cards for specific temperatures?
