var gameBoardModule = (() =>{
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
    }


    function checkWinner() {
        let winner = null
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

        const drawGame = gameboard.every((square) => {
            return (square !== "")
        })
        if (drawGame) { winner = 'Draw'}

        if (winner !== null) {
            return alert(winner)
        }
    }

    function updateGameboard(squareIndex) {
        gameboard[squareIndex] = Game.getCurrentPlayer();
    }

    return {
        renderBoard, checkWinner, updateGameboard, restartGame
    }

})()

const PlayerFactory = (playerName, playerMark) => {
    return {playerName, playerMark}
}

const Game = ( function() {
    let currentPlayer = "X"
    
    function getCurrentPlayer() {
        return currentPlayer
    }
    function togglePlayer() {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
    }



    return { getCurrentPlayer, togglePlayer} 

})()


//use this to change the visual board and adjust the inner board
const displayController = ( function() {
    function makeMove(HTMLsquare,index) {
        if (checkValidMove(HTMLsquare)) {
            HTMLsquare.textContent = Game.getCurrentPlayer()
            gameBoardModule.updateGameboard(index)
            gameBoardModule.checkWinner()
            Game.togglePlayer()
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
        const boardDIV = document.querySelector(".board")
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


startBtn2Players = document.querySelector(".start-btn-2players")
startBtn2Players.addEventListener('click', () => {
    displayPlayerName()
})

function displayPlayerName() {
    player1Name = document.querySelector("#player1").value
    player2Name = document.querySelector("#player2").value
    
    player1 = PlayerFactory(player1Name, "X")
    player2 = PlayerFactory(player2Name, "O")
    
    player1DisplayName = document.querySelector(".player1-container")
    player1DisplayName.textContent = player1.playerName
    
    player2DisplayName = document.querySelector(".player2-container")
    player2DisplayName.textContent = player2.playerName
}

restartGameBtn = document.querySelector(".restart-btn")
restartGameBtn.addEventListener("click", ()=> {
    gameBoardModule.restartGame()
})


gameBoardModule.renderBoard()

// displayController