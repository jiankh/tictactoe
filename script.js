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
        renderBoard, checkWinner, updateGameboard
    }

})()

const PlayerFactory = (playerName, playerMark) => {
    return {playerName, playerMark}
}

const Game = ( function() {
    let currentPlayer = "X"

    //valid move
    function checkValidMove(currentSelection) {
        return (currentSelection.textContent === "")   
    }
    function getCurrentPlayer() {
        return currentPlayer
    }

    function togglePlayer() {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
    }

    return { getCurrentPlayer, checkValidMove, togglePlayer} 

})()


//use this to change the visual board and adjust the inner board
const displayController = ( function() {
    function makeMove(HTMLsquare,index) {
        if (Game.checkValidMove(HTMLsquare)) {
            HTMLsquare.textContent = Game.getCurrentPlayer()
            gameBoardModule.updateGameboard(index)
            gameBoardModule.checkWinner()
            Game.togglePlayer()
        }
    }

    squares = document.querySelectorAll('.square')
    squares.forEach((square, index) => {
    square.addEventListener('click', () => {
        makeMove(square,index)     
        })
    })
    return {
    }
})()

gameBoardModule.renderBoard()

// displayController