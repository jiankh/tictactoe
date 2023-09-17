var gameBoardModule = (() =>{
    let gameboard = ["", "", "", "", "", "O", "", "", ""]

    

    let render = () => {
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
                console.log(winner)
            }
        }
        if (winner !== null) {
            return alert(winner)
        }
    }

    function updateGameboard(squareIndex) {
        gameboard[squareIndex] = currentPlayer;
    }

    return {
        render, checkWinner, updateGameboard
    }

})()






//valid move
function checkValidMove(currentSelection) {
    return (currentSelection.textContent === "")   
}

//make mark
function makeMove() {
    square.textContent = currentPlayer
}

function togglePlayer() {
    if (currentPlayer === "X") {
        currentPlayer = "O"
    } else { currentPlayer = "X"}
}



let currentPlayer = "X"

squares = document.querySelectorAll('.square')
squares.forEach((square, index) => {
    square.addEventListener('click', () => {
        if (checkValidMove(square)) {
            square.textContent = currentPlayer
            gameBoardModule.updateGameboard(index)
            gameBoardModule.checkWinner()
            togglePlayer()
        }
        
    })
})



gameBoardModule.render()

// displayController