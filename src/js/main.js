// variables
const arrows = document.querySelectorAll(".arrows .arrow");
const boardHtml = document.querySelector(".board");
const newGame = document.querySelector(".new");
const tryAgain = document.querySelector(".tryAgain");
const scoreHTML = document.querySelector(".score span");
const bestHTML = document.querySelector(".best span");

let coninueGame = false;


let board = localStorage.getItem("board")
    ? JSON.parse(localStorage.getItem("board"))
    : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
      ];
const rows = 4;
const cols = 4;
const win = 2048;
let score = 0;
scoreHTML.textContent = localStorage.getItem("score")
    ? localStorage.getItem("score")
    : 0;
bestHTML.textContent = localStorage.getItem("best")
    ? localStorage.getItem("best")
    : 0;

// event listeners
window.addEventListener("DOMContentLoaded", () => {
    setGame();
});

newGame.addEventListener("click", () => {
    resetGame();
});

tryAgain.addEventListener("click", () => {
    resetGame();
    tryAgainfunciton();
    savelocalStorage();
});

arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
        if (arrow.id === "ArrowLeft" && coninueGame === false) {
            slideLeft(arrow.id);
            setTwo();
            if (score) updateScore();
            savelocalStorage();

        }
        if (arrow.id === "ArrowRight" && coninueGame === false) {
            slideRight(arrow.id);
            setTwo();
            if (score) updateScore();
            savelocalStorage();

        }
        if (arrow.id === "ArrowUp" && coninueGame === false) {
            slideUpDown("ArrowUp", arrow.id);
            setTwo();
            if (score) updateScore();
            savelocalStorage();

        }
        if (arrow.id === "ArrowDown" && coninueGame === false) {
            slideUpDown("ArrowDown", arrow.id);
            setTwo();
            if (score) updateScore();
            savelocalStorage();

        }
    });
});

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft" && coninueGame === false) {
        slideLeft(e.code);
        setTwo();
        if (score) updateScore();
        savelocalStorage();
    }
    if (e.code === "ArrowRight" && coninueGame === false) {
        slideRight(e.code);
        setTwo();
        if (score) updateScore();
        savelocalStorage();
    }
    if (e.code === "ArrowUp" && coninueGame === false) {
        slideUpDown("ArrowUp", e.code);
        setTwo();
        if (score) updateScore();
        savelocalStorage();
    }
    if (e.code === "ArrowDown"  && coninueGame === false) {
        slideUpDown("ArrowDown", e.code);
        setTwo();
        if (score) updateScore();
        savelocalStorage();
    }
});

function evaluateGameOver() {}

function resetGame() {
    clearHTML();
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    score = 0;
    scoreHTML.textContent = 0;
    savelocalStorage();
    setGame();
}
function hasEmptyTile() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][i] === 0) return true;
        }
    }
    return false;
}
function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let set = false;
    while (!set) {
        let row = Math.floor(Math.random() * 4);
        let col = Math.floor(Math.random() * 4);

        if (board[row][col] === 0) {
            board[row][col] = 2;
            paintTiles(row, col, board);
            set = true;
        }
    }
}
function setGame() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            paintTiles(row, col, board);
        }
    }

    let emptyTiles = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === 0) emptyTiles++;
        }
    }
    if (emptyTiles === 16) {
        setTwo();
        setTwo();
    }
}
function paintTiles(row, col, board) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.setProperty("--x", col);
    tile.style.setProperty("--y", row);
    if (board[row][col]) {
        tile.classList.add(`x${board[row][col]}`);
        tile.textContent = board[row][col];
        document.querySelector(".board").appendChild(tile);
    }
}
function slideLeft() {
    if(isGameOver()){
        coninueGame = true;
        tryAgainfunciton();
        return;
    }
    clearHTML();
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row, "left");
        board[r] = row;
        for (let c = 0; c < cols; c++) {
            paintTiles(r, c, board);
        }
    }
}
function slideRight() {
    if(isGameOver()){
        coninueGame = true;
        tryAgainfunciton();
        return;
    }
    clearHTML();
    for (let r = 0; r < rows; r++) {
        let row = board[r].reverse();
        row = slide(row).reverse();
        board[r] = row;
        for (let c = 0; c < cols; c++) {
            paintTiles(r, c, board);
        }
    }
}
function slideUpDown(arrow) {
    if(isGameOver()){
        coninueGame = true;
        tryAgainfunciton();
        return;
    }
    clearHTML();
    let newBoard = turnsBoard(board);
    for (let r = 0; r < rows; r++) {
        if (arrow === "ArrowUp") {
            let row = newBoard[r];
            newBoard[r] = slide(row);
        }
        if (arrow === "ArrowDown") {
            let row = newBoard[r].reverse();
            newBoard[r] = slide(row).reverse();
        }
    }

    board = turnsBoard(newBoard);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            paintTiles(r, c, board);
        }
    }
}
function turnsBoard(board) {
    let boardTurns = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < rows; j++) {
            row.push(board[j][i]);
        }
        boardTurns.push(row);
    }
    return boardTurns;
}
function slide(row) {
    row = filterZero(row);

    row.forEach((element, index) => {
        if (element === row[index + 1]) {
            row[index] *= 2;
            row[index + 1] = 0;
            score += row[index];
        }
    });

    row = filterZero(row);

    while (row.length < cols) {
        row.push(0);
    }
    return row;
}
function tryAgainfunciton() {
    if (boardHtml.classList.contains("active")) {
        tryAgain.style.display = "none";
        boardHtml.classList.remove("active");
        return;
    }
    tryAgain.style.display = "block";
    boardHtml.classList.add("active");
}

// tools
function filterZero(row) {
    return row.filter((num) => num !== 0);
}

const clearHTML = () => {
    let tile = document.querySelectorAll(".tile");
    tile.forEach((tile) => {
        tile.remove();
    });
};

function updateScore() {
    const puntaje = document.querySelector(".puntaje");

    if (puntaje) {
        puntaje.remove();
    }
    const actualscore = Number(scoreHTML.textContent);
    const puntajeAnimation = document.createElement("div");
    puntajeAnimation.classList.add("animation", "puntaje");
    puntajeAnimation.textContent = `${score}+`;

    scoreHTML.textContent = actualscore + score;
    document.querySelector(".score").appendChild(puntajeAnimation);
    score = 0;
}

function savelocalStorage() {
    localStorage.setItem("board", JSON.stringify(board));

    let score = document.querySelector(".score span").textContent;
    localStorage.setItem("score", score);

    if (
        Number(score) > Number(document.querySelector(".best span").textContent)
    ) {
        document.querySelector(".best span").textContent = score;
        localStorage.setItem(
            "best",
            document.querySelector(".best span").textContent
        );
    }
}
function isGameOver() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === 0) return false;
            if (i !== rows - 1 && board[i][j] === board[i + 1][j]) return false;
            if (j !== cols - 1 && board[i][j] === board[i][j + 1]) return false;
        }
    }
    return true;
}

function isWon() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === 2048) return true;
        }
    }
    return false;
}