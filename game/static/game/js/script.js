let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let aiEnabled = false;
let timer = 0;
let interval;

const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

window.onload = () => {
    drawBoard();
    interval = setInterval(() => {
        document.getElementById('time').innerText = ++timer;
    }, 1000);
};

function drawBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    board.forEach((val, i) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.innerText = val;
        cell.onclick = handleMove;
        boardDiv.appendChild(cell);
    });
}

function handleMove(e) {
    const index = e.target.dataset.index;
    if (!gameActive || board[index]) return;

    playSound('click');
    board[index] = currentPlayer;
    addMoveToHistory(index);
    drawBoard();
    if (checkWin()) return;
    if (board.every(cell => cell)) {
        gameActive = false;
        playSound('draw');
        return alert("It's a draw!");
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (aiEnabled && currentPlayer === "O") setTimeout(aiMove, 500);
}

function aiMove() {
    const empty = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
    const move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = currentPlayer;
    playSound('click');
    addMoveToHistory(move);
    drawBoard();
    if (checkWin()) return;
    currentPlayer = "X";
}

function checkWin() {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            document.querySelectorAll('.cell')[a].classList.add('winning');
            document.querySelectorAll('.cell')[b].classList.add('winning');
            document.querySelectorAll('.cell')[c].classList.add('winning');
            gameActive = false;
            playSound('win');
            updateScore(currentPlayer);
            return true;
        }
    }
    return false;
}

function resetGame() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    timer = 0;
    document.getElementById('time').innerText = timer;
    drawBoard();
    document.getElementById('moveList').innerHTML = '';
}

function toggleMode() {
    aiEnabled = !aiEnabled;
    alert("AI Mode: " + (aiEnabled ? "ON" : "OFF"));
    resetGame();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function playSound(type) {
    document.getElementById(type + 'Sound').play();
}

function updateScore(player) {
    const score = document.getElementById('score' + player);
    score.innerText = parseInt(score.innerText) + 1;
}

function addMoveToHistory(index) {
    const move = document.createElement('li');
    move.innerText = `Player ${currentPlayer} → ${index}`;
    document.getElementById('moveList').appendChild(move);
}