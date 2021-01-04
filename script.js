const inputScreen = document.getElementById('inputScreen');
const gameScreen = document.getElementById('game');
const usernameInput = document.getElementById('p1');
const objectRadio = document.getElementsByName('choice');
var user_name = document.getElementById('username');
var item_left = document.getElementById('item-left');
var item_right = document.getElementById('item-right');
var user_status = document.getElementById('user-status');
var computer_status = document.getElementById('computer-status');
var tiles = document.getElementsByClassName('item');
var gridList = [ '', '', '', '', '', '', '', '', '' ];
var timesClickedList = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
const winCon = [
	[ 0, 1, 2 ],
	[ 0, 3, 6 ],
	[ 6, 7, 8 ],
	[ 2, 5, 8 ],
	[ 0, 4, 8 ],
	[ 2, 4, 6 ],
	[ 3, 4, 5 ],
	[ 1, 4, 7 ]
];
var user_score = document.getElementById('user-score');
var computer_score = document.getElementById('computer-score');
var tieScore = document.getElementById('tiesNum');
var playerTurn = document.getElementById('playerNameTurn');
var turnText = document.getElementById('playerTurn');
var instructions = document.querySelector('.instructions');
var ties = 0;
const green = '#98fb98';
const red = '#fa8072';
var user = {
	name: '',
	item: '',
	score: 0
};
var computer = {
	name: 'Computer',
	item: '',
	score: 0
};

// Onload function: displays input, hides game, sets eventListener for each tile
function init() {
	inputScreen.style.display = 'block';
	gameScreen.style.display = 'none';
	for (var i = 0; i < tiles.length; i++) {
		tiles[i].addEventListener('click', playerMove);
	}
}

// When "Play Game" is clicked, assigns names and items correspondingly
function submitNames() {
	if (usernameInput.value == '') {
		alert('Please Enter Username');
		return;
	}
	// Assigns user.item and user.initial and computer.initial
	for (var i = 0; i < objectRadio.length; i++) {
		if (objectRadio[i].checked) {
			user.item = objectRadio[i].value;
		}
	}
	setItems();
	inputScreen.style.display = 'none';
	gameScreen.style.display = 'block';
	if (user.item == 'X') {
		updateTurn(user.name);
		togglePointer('auto');
	} else {
		setTimeout(computerMove, 500);
	}
}

// Sets and displays all names/status/XO values
function setItems() {
	user.name = usernameInput.value;
	if (user.item == 'X') computer.item = 'O';
	else computer.item = 'X';
	item_left.innerText = user.item;
	item_right.innerText = computer.item;
	user_name.innerText = user.name;
	user_status.innerText = user.name;
}

// Function when player clicks on tile
function playerMove(e) {
	var selectedTile = e.target.getAttribute('value');
	if (timesClickedList[selectedTile] == 1) return;
	togglePointer('none');
	clickAndCheck(selectedTile, user.item);
	if (checkForWin()) {
		if (turnText.innerText !== 'DRAW!') congrats(user.name);
		setTimeout(clearBoard, 1000);
		setTimeout(ridColor, 1000);
		setTimeout(nextGame, 1500);
		return;
	}
	updateTurn(computer.name);
	setTimeout(computerMove, 500);
}

// Function for computer move
function computerMove() {
	togglePointer('none');
	if (!aggressive()) defensive();
	if (checkForWin()) {
		if (turnText.innerText !== 'DRAW!') congrats(computer.name);
		setTimeout(clearBoard, 1000);
		setTimeout(ridColor, 1000);
		setTimeout(nextGame, 1500);
		return;
	}
	updateTurn(user.name);
	togglePointer('auto');
}

// Changes to item, and checks for lock (red)
function clickAndCheck(index, item) {
	if (timesClickedList[index] == 1) return false;
	if (gridList[index] == item) timesClickedList[index]++;
	gridList[index] = item;
	display();
	if (timesClickedList[index] == 1) changeColor(tiles[index], red);
	return true;
}
// Aggressive inserts computer.item next to other computer.items to win
function aggressive() {
	for (var i = 0; i < winCon.length; i++) {
		if (
			gridList[winCon[i][0]] == computer.item &&
			gridList[winCon[i][1]] == computer.item &&
			timesClickedList[winCon[i][2]] !== 1
		) {
			clickAndCheck(winCon[i][2], computer.item);
			return true;
		}
		if (
			gridList[winCon[i][0]] == computer.item &&
			gridList[winCon[i][2]] == computer.item &&
			timesClickedList[winCon[i][1]] !== 1
		) {
			clickAndCheck(winCon[i][1], computer.item);
			return true;
		}
		if (
			gridList[winCon[i][2]] == computer.item &&
			gridList[winCon[i][1]] == computer.item &&
			timesClickedList[winCon[i][0]] !== 1
		) {
			clickAndCheck(winCon[i][0], computer.item);
			return true;
		}
		if (i == 7) return false;
	}
}

// Defensive inserts computer.item on top of user.items to prevent them from winning
function defensive() {
	var rnd1 = getRandomInteger(0, 1);
	var rnd2 = getRandomValueOf([ 0, 2 ]);
	var rnd3 = getRandomInteger(1, 2);
	for (var i = 0; i < winCon.length; i++) {
		if (
			gridList[winCon[i][0]] == user.item &&
			gridList[winCon[i][1]] == user.item &&
			timesClickedList[winCon[i][rnd1]] !== 1
		) {
			clickAndCheck(winCon[i][rnd1], computer.item);
			return;
		}
		if (
			gridList[winCon[i][0]] == user.item &&
			gridList[winCon[i][2]] == user.item &&
			timesClickedList[winCon[i][rnd2]] !== 1
		) {
			clickAndCheck(winCon[i][rnd2], computer.item);
			return;
		}
		if (
			gridList[winCon[i][2]] == user.item &&
			gridList[winCon[i][1]] == user.item &&
			timesClickedList[winCon[i][rnd3]] !== 1
		) {
			clickAndCheck(winCon[i][rnd3], computer.item);
			return;
		}
		if (i == 7) {
			compRandomMove();
			return;
		}
	}
}

// Plays a random move for computer
function compRandomMove() {
	var rnd = getRandomInteger(0, 8);
	if (timesClickedList[rnd] == 1) {
		compRandomMove();
	}
	clickAndCheck(rnd, computer.item);
	display();
}

// Checking for winning conditions by cycling through winCon list
function checkForWin() {
	var tmp = [];
	var indexes = [];

	for (var i = 0; i < winCon.length; i++) {
		for (var k = 0; k < 3; k++) {
			// tmp holds the values in current gridList; Ex: "X,X,O" or "O,O,O"
			tmp.push(gridList[winCon[i][k]]);
			// indexes holds the indexes of the current values in tmp
			indexes.push(winCon[i][k]);
		}
		// Checks if 'X' Wins
		if (tmp.toString() == 'X,X,X') {
			winChange(indexes, 'X');
			tmp = [];
			indexes = [];
			return true;
		}
		// Checks if 'O' Wins
		if (tmp.toString() == 'O,O,O') {
			winChange(indexes, 'O');
			tmp = [];
			indexes = [];
			return true;
		}
		tmp = [];
		indexes = [];
	}
	// Checks for Tie
	if (isArrayFull(gridList)) {
		for (var i = 0; i < tiles.length; i++) {
			changeColor(tiles[i], red);
		}
		updateScore('tie');
		return true;
	}
	return false;
}

// Visual effects and score changes for when a player wins
function winChange(indexes, item) {
	togglePointer('none');
	for (var j = 0; j < indexes.length; j++) {
		changeColor(tiles[indexes[j]], green);
	}
	updateScore(item);
	setTimeout(ridColor, 1000);
	setTimeout(clearBoard, 1000);
}

// Checks if an array is full: returns true if no empty ('') values
function isArrayFull(arr) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == '') return false;
	}
	return true;
}

// Changes player's turn name
function updateTurn(player) {
	var content = `<div id = "turnText">It is <span id = "playerNameTurn">${player}</span>'s Turn</div>`;
	turnText.innerHTML = content;
}

// Clears the board
function clearBoard() {
	gridList = [ '', '', '', '', '', '', '', '', '' ];
	timesClickedList = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
	display();
}

// Displays tic tac toe grid based on gridList array values
function display() {
	var items = document.getElementsByTagName('td');
	for (var i = 0; i < gridList.length; i++) {
		items[i].innerText = gridList[i];
	}
}

// Toggles pointer events on tiles based on parameter ('none' or 'auto')
function togglePointer(val) {
	for (var i = 0; i < tiles.length; i++) {
		tiles[i].style.pointerEvents = val;
	}
}

// Changes background color of element in parameters
function changeColor(element, color) {
	element.style.backgroundColor = color;
}

// Updates player scores
function updateScore(item) {
	if ((user.item = item && item_left.innerText == item)) {
		user.score++;
		user_score.innerText = user.score;
		changeColor(user_score, green);
	}
	if ((computer.item = item && item_right.innerText == item)) {
		computer.score++;
		computer_score.innerText = computer.score;
		changeColor(computer_score, green);
	}
	if (item == 'tie') {
		ties++;
		tieScore.innerText = ties;
		changeColor(tieScore, green);
		congrats('tie');
	}
}

// Removes all color
function ridColor() {
	changeColor(user_score, 'transparent');
	changeColor(computer_score, 'transparent');
	changeColor(tieScore, 'transparent');
	for (var i = 0; i < tiles.length; i++) {
		changeColor(tiles[i], 'transparent');
	}
}

// Resets everything
function reset() {
	clearBoard();
	user.score = 0;
	computer.score = 0;
	ties = 0;
	user_score.innerText = user.score;
	computer_score.innerText = computer.score;
	tieScore.innerText = ties;
	ridColor();
	setItems();
	if (user.item == 'O') {
		togglePointer('none');
		setTimeout(computerMove, 500);
		togglePointer('auto');
	}
}

// Gets random integer between lower and upper values (inclusive)
function getRandomInteger(lower, upper) {
	var multiplier = upper - (lower - 1);
	var rnd = parseInt(Math.random() * multiplier) + lower;

	return rnd;
}

// Congratulations winner and begins next game with opposite player
function congrats(winner) {
	if (winner == 'tie') {
		turnText.innerHTML = 'DRAW!';
	} else {
		turnText.innerHTML = 'Congratulations ' + winner + '!';
	}
}

function nextGame() {
	var tmp = item_left.innerText;
	item_left.innerText = item_right.innerText;
	item_right.innerText = tmp;
	user.item = item_left.innerText;
	computer.item = item_right.innerText;
	if (user.item == 'X') {
		updateTurn(user.name);
		togglePointer('auto');
	} else {
		updateTurn(computer.name);
		setTimeout(computerMove, 500);
	}
}

// Returns random value within array provided
function getRandomValueOf(arr) {
	let rnd = getRandomInteger(0, arr.length - 1);
	return arr[rnd];
}

function dropDown() {
	if (instructions.style.display == 'block') {
		instructions.style.display = 'none';
	} else {
		instructions.style.display = 'block';
	}
}
