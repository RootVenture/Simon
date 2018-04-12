const topDivs = document.querySelectorAll(".top div");
const botDivs = document.querySelectorAll(".bot div");
const userMsg = document.querySelector(".userMsg");
const display = document.querySelector(".display");
const start = document.querySelector(".start");
const strict = document.querySelector(".strict");
const strictIndicator = document.querySelector(".strict__indicator");
const toggleBtn = document.querySelector(".toggle");
const switchBtn = document.querySelector(".switch");
const moves = ["green", "blue", "red", "yellow"];
let sequence = [];
let history = [];
let count = 1;
let historyIdx = 0;
let playerTurn = false;
let strictMode = false;
let game = true;

// User Story: I am presented with a random series of button presses.
function generateMoves() {
	for (let i = 0; i < 20; i++) {
		sequence.push(moves[Math.floor(Math.random() * moves.length)]);
	}
}

function lightUp(item) {
	const color = document.querySelector(`.${item}`);
	color.classList.add(`${item}--active`);
	color.classList.remove(`${item}--inactive`);
	setTimeout(() => {
		color.classList.add(`${item}--inactive`);
		color.classList.remove(`${item}--active`);
	}, 1000);
}

function startSequence() {
	playerTurn = false; // prevent actions while the computer is listing out display
	let i = 0;
	const interval = setInterval(() => {
		lightUp(sequence[i]);
		playSound(sequence[i]);
		i++;
		if (i >= count) {
			// play the player part of the game
			player();
			clearInterval(interval);
		}
	}, 1000 + (i + 1) * 1000);
}

function player() {
	playerTurn = true;
	history = [];
	historyIdx = 0;
}

// User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.
function checkMove(clicked, correct) {
	if (playerTurn) {
		if (clicked === correct) {
			historyIdx++;
			playSound(clicked);
			if (count === historyIdx) {
				count++;
				// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.
				if (count > 20) {
					game = false; // stop game
					userMsg.innerHTML =
						"Congratulations, you have won the game! Do you want to play again?";
					clearGame();
				}
				startSequence(); // start up next sequence of moves
				updateCount(); // update our display with new # of moves
			}
		}
		if (clicked !== correct) {
			wrongMove(clicked);
		}
	}
}

// User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.
function playSound(clr) {
	const index = moves.indexOf(clr) + 1;
	const audio = new Audio(
		`https://s3.amazonaws.com/freecodecamp/simonSound${index}.mp3`
	);
	audio.currentTime = 0;
	audio.play();
}

// User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.
function wrongMove(select) {
	userMsg.innerHTML = `YOU SELECTED THE WRONG COLOR, <strong style="color: red">${select.toUpperCase()}</strong>.`;
	display.innerHTML = "!!";
	setTimeout(() => {
		updateCount();
		userMsg.innerHTML = "";
	}, 1500);
	if (strictMode) {
		clearGame();
	} else {
		startSequence();
	}
}

// User Story: I can see how many steps are in the current series of button presses.
function updateCount() {
	display.innerHTML = count > 10 ? count : `0${count}`;
}

// User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.
function clearGame() {
	sequence = [];
	count = 1;
	player();
	updateCount();
	if (strictIndicator.classList.contains("strict__indicator--active")) {
		strictMode = true;
	} else {
		strictMode = false;
	}
	setTimeout(() => {
		startGame();
	}, 1000);
}

// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
function toggleStrict() {
	if (game === false) {
		if (strictIndicator.classList.contains("strict__indicator--active")) {
			strictIndicator.classList.add("strict__indicator--inactive");
			strictIndicator.classList.remove("strict__indicator--active");
			strictMode = false;
		} else {
			strictIndicator.classList.add("strict__indicator--active");
			strictIndicator.classList.remove("strict__indicator--inactive");
			strictMode = true;
		}
	}
}

function toggleDisplay() {
	if (display.classList.contains("display--active")) {
		display.classList.add("display--inactive");
		display.classList.remove("display--active");
	} else {
		display.classList.add("display--active");
		display.classList.remove("display--inactive");
	}
}

function switchToggle() {
	if (switchBtn.classList.contains("switch--active")) {
		switchBtn.classList.add("switch--inactive");
		switchBtn.classList.remove("switch--active");
	} else {
		switchBtn.classList.add("switch--active");
		switchBtn.classList.remove("switch--inactive");
	}
}

function handleClick(e, section) {
	e.preventDefault();
	e.stopPropagation();
	if (playerTurn) {
		playSound(section);
		history.push(section);
		lightUp(section);
		checkMove(history[historyIdx], sequence[historyIdx]);
	} else {
		return false;
	}
}

function startGame() {
	game = true;
	generateMoves(); // set up the sequence for the game
	updateCount();
	// if toggled active, allow start
	if (switchBtn.classList.contains("switch--active") && playerTurn === false) {
		toggleDisplay(); // turn on the display
		startSequence();
	}
}

// document.addEventListener("DOMContentLoaded", () => {
start.addEventListener("click", startGame);
strict.addEventListener("click", e => toggleStrict());
toggleBtn.addEventListener("click", switchToggle);
toggleBtn.addEventListener("click", switchToggle);
topDivs.forEach(div => {
	div.addEventListener("click", e => {
		if (playerTurn) {
			handleClick(e, e.target.classList[0]);
		}
	});
});

botDivs.forEach(div => {
	div.addEventListener("click", e => {
		if (playerTurn) {
			handleClick(e, e.target.classList[0]);
		}
	});
});
