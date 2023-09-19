let AI_MODE = false
let currentPlayer = "X"
let human 
let ai

const gameBoardModule = (() =>{
    let gameboard = ["", "", "", "", "", "", "", "", ""]

    let renderBoard = () => {
        gameboard.forEach((square, index) => {
            if (square !== "") {
                let currentSquare = document.querySelector(`#square-${index}`)
                currentSquare.textContent = `${square}`
            } 
        })
    } 

    function restartGame() {
        gameboard = ["", "", "", "", "", "", "", "", ""]
        gameboard.forEach((square, index) => {
            let currentSquare = document.querySelector(`#square-${index}`)
            currentSquare.textContent = ""
        })
        if (AI_MODE && ai==="X") {
            currentPlayer = "X"
            bestMove()
        } 
    }
    const restartGameBtn = document.querySelectorAll(".restart-btn")
    
    restartGameBtn.forEach((button) => {
        button.addEventListener("click", ()=> {
            restartGame()
            winnerDialog.close()
    })})

    function checkWinner() {
        let winner = null

        //check if all the squares are taken and the game is over
        const drawGame = gameboard.every((square) => {
            return (square !== "")
        })
        if (drawGame) { winner = 'Draw'}

        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i=0; i<winningCombinations.length; i++) {
            const [a,b,c] = winningCombinations[i]
            if (gameboard[a] === gameboard[b] && gameboard[b] === gameboard[c] && gameboard[a] !== "") {
                winner = gameboard[a]
            }
        }
        return winner
    }

    const winnerDialog = document.querySelector(".dialog")
    function announceWinner(winner) {   
        const dialogTEXT = document.querySelector(".dialog-text")
        if (winner === "Draw") {
            dialogTEXT.textContent = "It's a Draw!"
        }

        if (AI_MODE && winner === "X") {
            player1HTML = document.querySelector(".player1-container").textContent
            dialogTEXT.textContent = `${player1HTML} wins!`
        } else if (winner ==="O") {
            player2HTML = document.querySelector(".player2-container").textContent
            dialogTEXT.textContent = `${player2HTML} wins!`
        }

        if (Multiplayer.getPlayer1() && (winner === "X")) {
            dialogTEXT.textContent = `${Multiplayer.getPlayer1().playerName} wins!`
        } else if (Multiplayer.getPlayer2() && (winner === "O")) {
            dialogTEXT.textContent = `${Multiplayer.getPlayer2().playerName} wins!`
        }

        winnerDialog.show()
    }

    function updateGameboard(squareIndex) {
        gameboard[squareIndex] = currentPlayer;
    }

    // LOGIC FOR AI

    let currentPlayerAi = human

    function bestMove() {
        let bestScore = -Infinity
        let move 
        for (let i = 0; i < gameboard.length; i++) {
            if (gameboard[i] === "") {
                gameboard[i] = ai
                let score = minimax(gameboard, 0, false)
                gameboard[i] = ""
                if (score > bestScore) {
                    bestScore = score
                    move = i
                }
            }
        }
        gameboard[move] = ai
        updateGameboard(move)
        renderBoard()

        result = gameBoardModule.checkWinner()
            if (result !== null) {
                gameBoardModule.announceWinner(result)
            }        

        currentPlayerAi = human
        Game.togglePlayer()
    }

    let scores = {
        "X":-10,
        "O":10,
        "Draw":0
    }


    //good for YOU[X] X= -10

    function minimax(board, depth, isMaximizing) {
        let result = checkWinner()
        if (result !== null) {
            return scores[result]
        }

        if (isMaximizing) {
            let bestScore = -Infinity
            for (let i=0; i < gameboard.length; i++) {
                if (board[i] === "") {
                    board[i] = ai
                    let score = minimax(board, depth+1, false)
                    board[i] = ""
                    bestScore = Math.max(score,bestScore)
                }
            }
            return bestScore
        } else {
            let bestScore = Infinity
            for (let i=0; i < gameboard.length; i++) {
                if (board[i] === "") {
                    board[i] = human
                    let score = minimax(board, depth+1, true)
                    board[i] = ""
                    bestScore = Math.min(score,bestScore)
                }
            }
            return bestScore
        }
        
    } 
    
    function flipScoresValues() {
        console.log(scores["X"] )
        if (scores["X"] === -10) {
            scores = {
            "X":10,
            "O":-10,
            "Draw":0
        }}
    }


    return {
        flipScoresValues, renderBoard, checkWinner, updateGameboard, restartGame, announceWinner, bestMove, getCurrentPlayerAi: () => currentPlayerAi
    }

})()

const PlayerFactory = (playerName, playerMark) => {
    return {playerName, playerMark}
}

const Game = ( function() {

    function togglePlayer() {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
    }

    return { togglePlayer} 
})()

//use this to change the visual board and adjust the inner board
const displayController = ( function() {

    function makeMove(HTMLsquare,index) {
        if (checkValidMove(HTMLsquare)) {
            HTMLsquare.textContent = currentPlayer
            gameBoardModule.updateGameboard(index)       
            result = gameBoardModule.checkWinner()
            if (result !== null) {
                gameBoardModule.announceWinner(result)
            }
            Game.togglePlayer()

            if (AI_MODE) {
                gameBoardModule.bestMove()

                result = gameBoardModule.checkWinner()
                if (result !== null) {
                    gameBoardModule.announceWinner(result)
                }
            }
        }
    }


    function checkValidMove(currentSelection) {
        return (currentSelection.textContent === "")   
    }

    squares = document.querySelectorAll('.square')
    squares.forEach((square, index) => {
    square.addEventListener('click', () => {
        makeMove(square,index)     
        })
    })

    function toggleHidden(board,singleplayer,multiplayer) {
        const boardDIV = document.querySelector(".board-container")
        const singleplayerDIV = document.querySelector(".ai-selection")
        const multiDIV = document.querySelector(".player-selection-container")
        
        boardDIV.classList.add('hidden')
        singleplayerDIV.classList.add('hidden')
        multiDIV.classList.add('hidden')

        if (board) {      
            boardDIV.classList.remove('hidden')
        } else if (singleplayer) {
            singleplayerDIV.classList.remove('hidden')
        } else if (multiplayer) {
            multiDIV.classList.remove('hidden')
        }
    }

    return { toggleHidden
    }
})()

const Multiplayer = (function() {
    //START WITH 2 PLAYERS
    let player1
    let player2
    

    function displayPlayerName() {
        const player1DisplayName = document.querySelector(".player1-container")
        const player2DisplayName = document.querySelector(".player2-container")

        const player1Name = document.querySelector("#player1").value
        const player2Name = document.querySelector("#player2").value
        
        player1 = PlayerFactory(player1Name, "X")
        player2 = PlayerFactory(player2Name, "O")

        player1DisplayName.textContent = player1.playerName
        player2DisplayName.textContent = player2.playerName

    }


    const startBtn2Players = document.querySelector(".start-btn-2players")
    startBtn2Players.addEventListener('click', () => {
        displayPlayerName()
        displayController.toggleHidden(true,false,false)
    })

    return { getPlayer1: () => player1, getPlayer2: () => player2, 
        }
    
})()

const SinglePlayer = ( function() {

    const startAIbtn = document.querySelector(".choice-ai")
    startAIbtn.addEventListener("click", () => {
        displayController.toggleHidden(false, true, false)
        AI_MODE = true
    })

    const selectedAiX = document.querySelector(".select-x")
    const selectedAiO = document.querySelector(".select-o")

    const player1DisplayName = document.querySelector(".player1-container")
    const player2DisplayName = document.querySelector(".player2-container")
    function displayAiName(choice) {
        if (choice === "X") {
            player1DisplayName.textContent = "You"
            player2DisplayName.textContent = "AI"
        } else {
            console.log(player2DisplayName)
            player1DisplayName.textContent = "AI"
            player2DisplayName.textContent = "You"
        }
    }

    selectedAiX.addEventListener("click", () => {
        displayAiName("X")
        displayController.toggleHidden(true, false, false)
        human = "X"
        ai = "O"
    })

    selectedAiO.addEventListener("click", () => {
        displayAiName("O")
        displayController.toggleHidden(true, false, false)
        human = "O"
        ai = "X"
        gameBoardModule.flipScoresValues()
        gameBoardModule.bestMove()
    })

})()

gameBoardModule.renderBoard()

// displayController