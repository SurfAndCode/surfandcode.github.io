
const TicTacToeModule = (() => {
  const AI = "X";
  const human = "O";
  const grids = document.querySelectorAll(".grid-item");
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  const reset = document.querySelector("button");
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], 
    [2, 4, 6], 
  ];
  let gameBoard = ["","","","","","","","",""];
  let currentPlayer = AI;
  let gameOver = false;
  let gameOverMsg = document.querySelector("h2");
  let winningCondition;
  let scores = {
    X: 10,
    O: -10,
    tie: 0 
  };

  function removeClickEventListener() {
    grids.forEach(grid => {
      if (grid.innerText !== "" || gameOver) {
        grid.removeEventListener("click", handleClick);
      }
    });
  }

  function updateDisplay(arr) {
    for (i = 0; i < arr.length; i++) {
        let grid = document.getElementById(i);
        grid.innerText = arr[i];
        removeClickEventListener();
    }
  }

  function updateGameBoard(id, currentPlayer) {
      gameBoard[id] = currentPlayer;
  }

  function handleClick(e) {
    updateGameBoard(e.target.id, currentPlayer);
    updateDisplay(gameBoard);
    checkWinningConditions(currentPlayer)
    setTimeout(AIMove, 400);
  }

  function checkWinningConditions(currentPlayer) {
      let winner = null;
      for (let i = 0; i <= 7; i++) {
          const winCondition = winConditions[i];
          let a = gameBoard[winCondition[0]];
          let b = gameBoard[winCondition[1]];
          let c = gameBoard[winCondition[2]];
          if (a === "X" && b === "X" && c === "X") {
            winner = AI;
            winningCondition = winConditions[i];
            return winner;
          } else if (a === "O" && b === "O" && c === "O")
          {
              winner = human;
              winningCondition = winConditions[i];
              return winner;
          }
      }
      let roundDraw = !gameBoard.includes("");
      if (roundDraw) {
          return "tie";
      }
      return winner;
  }

  function displayWinner() {
    let winner;
    winner = checkWinningConditions(currentPlayer)
    if (winner === AI) {
      gameOver = true;
      flash(winningCondition);
      gameOverMsg.innerText = "Game Over! The winner is AI";
    } else if (winner === human) {
      gameOver = true;
      flash(winningCondition);
      gameOverMsg.innerText = "Game Over! The winner is Human";
    } else if (winner === "tie") {
      gameOver = true;
      gameOverMsg.innerText = "It's a tie!";
    }
  }

  function flash(winCondition) {
    const [a, b, c] = winCondition;
    document.getElementById(a).classList.toggle("flash");
    document.getElementById(b).classList.toggle("flash");
    document.getElementById(c).classList.toggle("flash");
  }

  function removeFlash(grids) {
    grids.forEach(grid => {
      if (grid.classList.contains("flash")) {
        grid.classList.remove("flash");
      }
    });
  }

  function startGame() {
      gameBoard = ["","","","","","","","",""];
      updateDisplay(gameBoard);
      gameOver = false;
      gameOverMsg.innerText = "";
      removeFlash(grids);
      grids.forEach(grid => {
        grid.addEventListener("click", handleClick)
        }
      );
      if (document.getElementById("AI").checked) {
        currentPlayer === AI;
        AIMove();
      }
  }

  reset.addEventListener("click",startGame);

  function bestMove() {
      // AI to make its turn
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < gameBoard.length; i++) {
          // Is the spot available?
          if (gameBoard[i] == "") {
              gameBoard[i] = AI;
              let score = minimax(gameBoard, 0, false, currentPlayer);
              gameBoard[i] = "";
            if (score > bestScore) {
              bestScore = score;
              move = i;
            }
          }
      }
      gameBoard[move] = AI;
      currentPlayer = human;
      displayWinner();
    }
    
  function minimax(board, depth, isMaximizing, currentPlayer) {
    let result = checkWinningConditions(currentPlayer);
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < gameBoard.length; i++) {
          // Is the spot available?
          if (gameBoard[i] === "") {
            gameBoard[i] = AI;
            let score = minimax(gameBoard, depth + 1, false, currentPlayer);
            gameBoard[i] = "";
            bestScore = Math.max(score, bestScore);
          }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < gameBoard.length; i++) {
          // Is the spot available?
          if (gameBoard[i] === "") {
            gameBoard[i] = human;
            let score = minimax(gameBoard, depth + 1, true, currentPlayer);
            gameBoard[i] = "";
            bestScore = Math.min(score, bestScore);
          }
      }
      return bestScore;
    }
  }

  function toggleCheck() {
    radioButtons.forEach(radioButton => {
        radioButton.classList.toggle("checked");
        radioButton.classList.contains("checked") ? radioButton.checked = true : radioButton.checked = false;
        if (radioButton.checked) {
          if (radioButton.value === "AI") {
            currentPlayer = AI;
          } else {
            currentPlayer = human;
          }
        }
    });
  }

  radioButtons.forEach(function(radioButton){
    radioButton.addEventListener("click",toggleCheck);
  });

  function AIMove() {
    bestMove();
    updateDisplay(gameBoard);
  }

})()