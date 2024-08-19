const savedSnowEl = document.getElementById("saved-snow");
const currentSnowEl = document.getElementById("current-snow");
const addSnowBtn = document.getElementById("add-snow");
const takeSnowBtn = document.getElementById("take-snow");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const span = document.getElementById("close-btn");
const submitBtn = document.getElementById("submit-btn");
const modalInput = document.getElementById("modal-input");
const interestEarnedEl = document.getElementById("interest-earned");

const addMsg = "How much Snow would you like to add? (ONLY WHOLE NUMBERS)";
const takeMsg = "How much Snow would you like to take? (ONLY WHOLE NUMBERS)";

let savedSnow = 0;
let correctSavingsAccount;
let snow;
let interestEarned = 0;

// Compound interest function
function compoundInterest(amount, periods) {
	const rate = 0.01;
	const compoundedAmount = amount * Math.pow(1 + rate, periods);
	interestEarned += compoundedAmount - amount;
	return parseFloat(compoundedAmount);
}

// Transaction function
function saveTransaction(transaction) {
	const userInput = parseFloat(modalInput.value);

	// Check if user input is a whole number
	if (!Number.isInteger(userInput)) {
		alert("Please enter a whole number.")
		return; 
	}

	if (transaction === "add") {
		if (snow >= userInput) {
			snow -= userInput;
			savedSnow += userInput;
		} else {
			alert("You're trying to add too much Snow.");
		}
	} else {
		if (savedSnow >= userInput) {
			savedSnow -= userInput;
			snow += userInput;
		} else {
			alert("You're trying to take too much Snow.");
		}
	}

	savedSnowEl.textContent = `Saved Snow: ${savedSnow.toFixed(2)}`;
	currentSnowEl.textContent = `Unsaved Snow: ${snow}`;
	interestEarnedEl.textContent = `Interest Earned: +${interestEarned.toFixed(2)}`;
	modal.style.display = "none";
	modalInput.value = "";
	saveGameState();
}

// Modal
function displayModal(text, transaction) {
	modal.style.display = "flex";
	span.style.display = "none";
	modalText.textContent = text;
	setTimeout(function() {
		span.style.display = "block";
	}, 750);

	submitBtn.onclick = function() {
		saveTransaction(transaction);
	};
}

span.onclick = function() {
	modal.style.display = "none";
}

// Load game state function
function loadGameState() {
  const gameState= JSON.parse(sessionStorage.getItem("gameState"));
	const savedSnowState = JSON.parse(sessionStorage.getItem("savedSnowState"));

  if (gameState) {
    snow = gameState.snow || 0;
		correctSavingsAccount = gameState.correctSavingsAccount || 0;
  }

	if (savedSnowState) {
		savedSnow = savedSnowState.savedSnow || 0;
		interestEarned = savedSnowState.interestEarned || 0;
	}

	if (correctSavingsAccount > 0 && savedSnow > 0) {
		savedSnow = compoundInterest(savedSnow, correctSavingsAccount);
		saveGameState()
	}

	savedSnowEl.textContent = `Saved Snow: ${savedSnow.toFixed(2)}`;
	currentSnowEl.textContent = `Unsaved Snow: ${snow}`;
	interestEarnedEl.textContent = `Interest Earned: +${interestEarned.toFixed(2)}`;
}

// Event listeners
addSnowBtn.addEventListener("click", function() {
	displayModal(`${addMsg} You have ${snow} Snow available to add.`, "add");
});

takeSnowBtn.addEventListener("click", function() {
	displayModal(`${takeMsg} You have ${savedSnow.toFixed(2)} Snow available to take.`, "take");
});

// Save game state function
function saveGameState() {
	const gameState = JSON.parse(sessionStorage.getItem('gameState')) || {};
	gameState.snow = snow;
	gameState.correctSavingsAccount = 0;
	sessionStorage.setItem('gameState', JSON.stringify(gameState));

	const savedSnowState = {
    savedSnow: savedSnow,
	interestEarned: interestEarned
  };
  sessionStorage.setItem('savedSnowState', JSON.stringify(savedSnowState));
}

loadGameState();