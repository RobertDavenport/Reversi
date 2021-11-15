/*Robert Davenport, 102-07-868, 11/15/21, Assignment 03,
A symbolic ai approach to the game of Reversi/Othello. A basic implementation of the game
with JS, HTML, CSS. Uses the minimax algorithim to calculate the best position at a depth.
Also can turn alpha beta pruning on through the UI (on by default) to see the difference in
speeds between algorithims. A simple heuristic of score was used, but added the ability to
evaluate a given positions score based on the values of each square a position holds and
evaluate the total legal moves. Currently unclear which heuristic is best */

// Weights adapted thanks to Daniel Connelly http://dhconnelly.com/paip-python/docs/paip/othello.html.
const squareWeights = [
                         [120, -20,  20,   5,   5,  20, -20, 120],
                         [-20, -40,  -5,  -5,  -5,  -5, -40, -20],
                         [ 20,  -5,  15,   3,   3,  15,  -5,  20],
                         [  5,  -5,   3,   3,   3,   3,  -5,   5],
                         [  5,  -5,   3,   3,   3,   3,  -5,   5],
                         [ 20,  -5,  15,   3,   3,  15,  -5,  20],
                         [-20, -40,  -5,  -5,  -5,  -5, -40, -20],
                         [120, -20,  20,   5,   5,  20, -20, 120],
                    ];

var initialBoard =  [   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', 'b', 'w', ' ', ' ', ' '],
                        [' ', ' ', ' ', 'w', 'b', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
                    ];

var debugBoard =    [   ['w', 'b', 'b', 'b', 'b', 'b', 'b', ' '],
                        ['w', 'w', 'b', 'w', 'w', 'w', 'w', 'w'],
                        ['b', 'b', 'w', 'b', 'b', 'w', 'b', 'w'],
                        ['b', 'b', 'b', 'w', 'b', 'w', 'b', 'w'],
                        ['b', 'w', 'b', 'b', 'w', 'b', 'w', 'w'],
                        ['b', 'b', 'b', 'w', 'b', 'w', 'b', 'w'],
                        ['b', 'b', 'b', 'b', 'w', 'w', 'w', 'w'],
                        [' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w']
                ];

var test = [
    [
        "b",
        "l",
        "w",
        "w",
        "l",
        "w",
        "b",
        "b"
    ],
    [
        "b",
        "l",
        "w",
        "w",
        "w",
        "w",
        "w",
        "b"
    ],
    [
        "b",
        "w",
        "w",
        "w",
        "w",
        "w",
        "w",
        "b"
    ],
    [
        "b",
        "w",
        "w",
        "w",
        "w",
        "w",
        "w",
        "b"
    ],
    [
        "b",
        "w",
        "w",
        "b",
        "w",
        "b",
        "w",
        "b"
    ],
    [
        "b",
        "w",
        "b",
        "w",
        "b",
        "w",
        "w",
        "b"
    ],
    [
        "b",
        "b",
        "w",
        "w",
        "w",
        "b",
        "w",
        "b"
    ],
    [
        "b",
        "b",
        "b",
        "w",
        "w",
        "w",
        "w",
        "w"
    ]
]

var lmDebugBoard =  [   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', 'b', ' ', ' ', 'w', ' ', ' '],
                        [' ', ' ', ' ', 'b', 'w', ' ', ' ', ' '],
                        [' ', ' ', ' ', 'w', 'b', ' ', ' ', ' '],
                        [' ', ' ', ' ', 'w', 'b', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
                    ];

/* north, east, south, west, north-east, south-east, south-west, north-west in format: (x,y)*/                    
var adjacentCoordinates = [ [0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1] ];

// retuns an 'l' at every index there is a legal move for a board
function calculateLegalMoves(board, player){
    let currentBoard = copy2DArray(board) 
    for (row = 0; row < 8; row++) {
        for (column = 0; column < 8; column++){
            if (board[row][column] === ' ') {
                // if it is a legal move place an l at that index
                if (isLegalMove(board, row, column, player)){                  
                    currentBoard[row][column] = 'l'
                }
            }
        }
    }
    return currentBoard
}

// Kicks off the legal move evaluation
function isLegalMove(board, row, column, player){
    if(checkAdjacent(board, row, column, player))
        return true;
}

// checks if their is an opponent on an adjacent square, .some returns true if any condition is true
function checkAdjacent(board, row, column, player){
    return adjacentCoordinates.some(coordinate => {
       return checkForOpponent(board, getOpponent(player), row, column, coordinate[1], coordinate[0])
   });
}

// not used now, checkForPlayer now called in check adjacent
// function checkLine(board, row, column, player){
//     return (adjacentCoordinates.some(dir => {
//         /*2x direction to skip*/
//         return (checkForPlayer(board, row + dir[1] + dir[1], column + dir[0] + dir[0], player, dir[0], dir[1]))
//    }));
// }

// checks for adjacent opponent, if found it kicks of checkForPlayer which checks if the player has a square
// in a straight line 
function checkForOpponent(board, opponent, row, column, x, y){
    // ignore out of bounds
    if(row + y < 0 || row + y > 7 || column + x < 0 || column + x > 7)
        return false;

    // must be adjacent to opponent piece
    else if(board[row + y][column + x] == opponent){
        // see if player has a tile in this coordinate line
        if(checkForPlayer(board, row+y, column+x, getOpponent(opponent), x, y))
            return true;
    }
    
    else
        return false;
}

// Takes in an (X, Y) direction and searches that path for the players tile
function checkForPlayer(board, row, column, player, x, y){
    // ignore out of bounds for this move
    if(row < 0 || row > 7 || column < 0 || column > 7)
        return false;

    // ignore out of bounds for next move, need place to set square
    if(row + y < 0 || row + y > 7 || column + x < 0 || column + x > 7)
        return false;
    
    // must be a line of opponent squares
    if (board[row][column] == ' ')
        return false
    
    if (board[row][column] == 'l')
        return false
    
    if (board[row][column] == player)
        return true;

    // continue the search
    return checkForPlayer(board, row + y, column + x, player, x, y) 
}

// playes the players tile at a specific coordinate
function playMove(board, player, move){
    let currentBoard = copy2DArray(board)
    // flip current piece since it is a known legal move
    currentBoard[move[0]][move[1]] = player
    // attempt to flip opponents pieces recursively in all directions
    adjacentCoordinates.forEach(direction => flipOpponentPieces(currentBoard, move[0]+direction[0], move[1]+direction[1], player, direction[0], direction[1]))
    return currentBoard;
}

// flips opponent pieces in straight lines from initial direction (x,y)
function flipOpponentPieces(board, row, column, player, x, y){
    // ignore out of bounds
    if(row < 0 || row > 7 || column < 0 || column > 7)
        return false;

    if(board[row][column] == ' ')
        return false;

        if(board[row][column] == 'l')
        return false;
    
    if(board[row][column] == player)
        return true

    else
        if(flipOpponentPieces(board, (row + x), (column + y), player, x, y)){
            board[row][column] = player
            return true;  
        }
        else
            return false;
            
}

// get the opposite of the current player
function getOpponent(player){
    return (player == 'w') ? 'b' : 'w';
}

// remove all 'l's from the board
function clearLegalMovesFromBoard(board){
    for(i=0; i<board.length; i++){
        for(j=0; j<board[0].length; j++){
            if(board[i][j] == 'l')
                board[i][j] = ' '
        }
    }
    return board;
}

// get the total count of legal moves
function countLegalMoves(board){
    var legal = 0;
    for(i=0; i<board.length; i++){
        for(j=0; j<board[0].length; j++){
            if(board[i][j] == 'l')
                legal++
        }
    }
    return legal;
}

// returns statistics about the current board state
function calculateBoardState(board){
    let black = 0;
    let white = 0;
    let legal = 0;
    let avail = 0;
    for(i=0; i<board.length; i++){
        for(j=0; j<board[0].length; j++){

            if(board[i][j] == 'b')
                black++

            else if(board[i][j] == 'w')
                white++

            else if(board[i][j] == 'l')
                legal++

            else if(board[i][j] == ' ')
                avail ++
        }
    }
    return [black, white, legal, (avail + legal)];
}

// called from the legal move buttons on front-end UI. button-data contains the row, col of the square clicked
async function handlePlayerMove(e){
    var row = parseInt(e.getAttribute("data-row"))
    var col = parseInt(e.getAttribute("data-col"))

    // safegaurd that the player is user selected color
    player = userColor  
    board = playMove(board, player, [row, col])
    drawGUI(board, getOpponent(player))

    // change player and refresh board
    player = getOpponent(player)
    board = prepareBoard(board, player)
    // if no legal moves for player, opponent turn
    if (countLegalMoves(board) == 0){
        // change player and refresh board
        player = getOpponent(player)
        board = prepareBoard(board, player)
        // neither player or bot have a move
        if (countLegalMoves(board) == 0){
            endGame(board)
            return;
        }    
        else {
            board = playBotMove(board, depth, player)
            return;
        }       
    }
    // no more available moves
    boardState = calculateBoardState(board)
    if (boardState[3] == 0)
        endGame(board)

    // had to slow down AI to make it more obvious a move was played
    await sleep(1000).then(() => {
        board = playBotMove(board, depth, player)
    });
}

// takes care of maintance of board (clearing), drawing new board, and displaying statistics
function drawGUI(board, player){
    const [blackScore, whiteScore, legalMoves, availMoves] = calculateBoardState(board)
    clearScreen()
    drawBoard(board, player)
    displayGameState(blackScore, whiteScore, player)
    console.log(board)
}

// clears the board of the previous players legal moves and creates a new board with new players legal moves
function prepareBoard(board, player){
    freshBoard = copy2DArray(board)
    freshBoard = clearLegalMovesFromBoard(freshBoard)
    freshBoard = calculateLegalMoves(freshBoard, player);
    return freshBoard
}

// gets, plays, and draws to screen the bots best move at a depth
function playBotMove(board, depth, player){
    botMoveIndex = getBotMove(board, depth, player)
    positions = calculateAllPositions(board, player)
    board = positions[botMoveIndex]
    drawGUI(board, getOpponent(player))
    player = getOpponent(player)
    const [black, white, legal, avail] = calculateBoardState(board)
    displayGameState(black, white, player)

    // must handle the player having no moves here since they will not have a button to press
    // bot will continue to play if opponent has 0 legal moves
    if (legal == 0 && avail > 0){
        player = getOpponent(player)
        board = prepareBoard(board, player)
        board = playBotMove(board, depth, player)
    }
    // no available moves
    else if (avail == 0)
        endGame(board)

    return board;
    
}

// this was needed for very low depths because bot was playing instantly
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// remove the board
function clearScreen(){
    document.getElementById("container").remove();
}

// draw new board from our 2D array
function drawBoard(board, player){

    var container = document.createElement('div')
    container.setAttribute("id", "container")
    container.classList.add('container')

    var gameBoard = document.createElement('table')
    gameBoard.setAttribute("id", "gameBoard")
    gameBoard.classList.add('board')

    var gameBody = document.createElement('tbody')

    for(row = 0; row < board.length; row++){
        var tr = document.createElement('tr')

        for(col = 0; col < board[0].length; col++){

            var td = document.createElement('td')
            td.classList.add('empty-square')
            if (board[row][col] == 'w'){
                var piece = document.createElement('div')
                piece.classList.add('white')
                piece.classList.add('piece')
                td.appendChild(piece)
            }
            if (board[row][col] == 'b'){
                var piece = document.createElement('div')
                piece.classList.add('black')
                piece.classList.add('piece')
                td.appendChild(piece)
            }
            if (board[row][col] == 'l' && player == userColor){
                var legalMove = document.createElement('button')
                legalMove.classList.add('legal')
                legalMove.classList.add('piece')
                legalMove.setAttribute('data-row', row)
                legalMove.setAttribute('data-col', col)
                legalMove.setAttribute("onclick", 'handlePlayerMove(this)')
                td.appendChild(legalMove)
            }
            tr.appendChild(td)
        }
        gameBody.appendChild(tr)
    }
    gameBoard.appendChild(gameBody)
    container.appendChild(gameBoard)
    document.body.appendChild(container) 
}

// sets the UI Statistic labels with calculated values
function displayGameState(blackScore, whiteScore, player){
    let blackDisplay = document.getElementById('blackScore')
    let whiteDisplay = document.getElementById('whiteScore')
    let playerDisplay = document.getElementById('currentPlayer')
    let botEvals = document.getElementById('totalPositions')
    blackDisplay.innerHTML = blackScore
    whiteDisplay.innerHTML = whiteScore
    playerDisplay.innerHTML = (player == 'b') ? 'black' : 'white'
    botEvals.innerHTML = totalEvals
}

// Displays the winner below the statistics
function endGame(board){
    let [blackScore, whiteScore, legalMoves, availMoves] = calculateBoardState(board)
    var winner = document.getElementById('winner')
    var winnerLabel = document.getElementById('winnerLabel')
    winner.innerHTML = (Math.max(blackScore, whiteScore) == blackScore) ? 'BLACK!!' : 'WHITE!!'
    winner.classList.remove('display-none')
    winnerLabel.classList.remove('display-none')
    drawGUI(board, player)
}

// Returns a list of the resulting position for playing each legal move on a board
function calculateAllPositions(board, player){
    var allPostions = []
    let currentBoard = copy2DArray(board)
    for(let row = 0; row < board.length; row++){
        for(let col = 0; col < board[0].length; col++){
            if(board[row][col] == 'l'){
                childBoard = playMove(currentBoard, player, [row, col])
                childBoard = clearLegalMovesFromBoard(childBoard)
                childBoard = calculateLegalMoves(childBoard, getOpponent(player))
                allPostions.push(childBoard)
            }
        }
    }
    return allPostions;
}

// minimax function
// returns evaluated heuristic (score) at a specified depth
function minimax(board, depth, player, maximizingPlayer){
    const [blackScore, whiteScore, legalMoves, availMoves] = calculateBoardState(board)
    // tracks the number or nodes evaluated for display purposes
    totalEvals++
    if (depth == 0 || (availMoves) == 0)
        if (heuristic == "legal moves")
            return legalMoves
        else if (heuristic == "board weights")
            return evaluatePositions(getPlayerPositions(board, getOpponent(player)))
        else if (heuristic == "score")
            return getScore(player, whiteScore, blackScore)

    if (maximizingPlayer){
        maxEval = negInf
        // get all child nodes and recursively traverse the tree
        calculateAllPositions(board, player).forEach(position => {       
            eval = minimax(position, depth-1, getOpponent(player), false)
            maxEval = Math.max(maxEval, eval)
            // Show board and evaluation
            if (debugMode) {
                console.log(position)
                console.log(eval)
            }        
        });
        return maxEval;
    }
    else {
        minEval = posInf
        // get all child nodes and recursively traverse the tree
        calculateAllPositions(board, player).forEach(position => {        
            eval = minimax(position, depth-1, getOpponent(player), true)
            minEval = Math.min(minEval, eval)
            // show board and evaluation
            if (debugMode) {
                console.log(position)
                console.log(eval)
            }             
        });
        return minEval
    }
}

// minimax function with alpha beta pruning
// returns evaluated heuristic (score) at a specified depth
function minimaxWithAlphaBetaPruning(board, depth, alpha, beta, maximizingPlayer, player){

    const [blackScore, whiteScore, legalMoves, availMoves] = calculateBoardState(board)
    totalEvals++
    if (depth == 0 || availMoves == 0){
        if (heuristic == "legal moves")
            return legalMoves
        else if (heuristic == "board weights")
            return evaluatePositions(getPlayerPositions(board, getOpponent(player)))
        else if (heuristic == "score")
            return getScore(player, whiteScore, blackScore)
    }

    // console.log(calculateAllPositions(board, player))
    // console.log(calculateAllPositions(board, player).map(x => minimaxWithAlphaBetaPruning(x, depth-1, negInf, posInf, maximizingPlayer, getOpponent(player))))

    if (maximizingPlayer){
        maxEval = negInf
        // get all childs and recursively traverse the tree, .some allows a break if our conidition is true
        calculateAllPositions(board, player).some(child => {
            eval = minimaxWithAlphaBetaPruning(child, depth-1, alpha, beta, false, getOpponent(player))
            maxEval = Math.max(maxEval, eval)
            alpha = Math.max(alpha, eval)
            if (debugMode) {
                console.log(child)
                console.log(eval)
            }             
            if ( beta <= alpha)
                return true;
        });
        return maxEval
    }
    else {
        minEval = posInf
        // get all children and recursively traverse the tree, .some allows a break if our conidition is true
        calculateAllPositions(board, player).some(child => {
            eval = minimaxWithAlphaBetaPruning(child, depth-1, alpha, beta, true, getOpponent(player))
            minEval = Math.min(minEval, eval)
            beta = Math.min(beta, eval)
            if (debugMode) {
                console.log(child)
                console.log(eval)
            }
            if (beta <= alpha)
                return true;
        });
        return minEval
    }
}

// A helper function to clone an array since Javascript array function arguments are mutable
function copy2DArray(array){
    return array.map(x => [...x]);
}

// Returns the index of the best Board from the minimax Algorithim
function getBotMove(board, depth, player){
    totalEvals = 0
    let newBoard = copy2DArray(board)
    if (withPruning){
        // The best oneliner of all time... Starts by getting all the positions for the current board. 
        // Mapping each board into an interger values (return of minimax), then reducing to index with the max values
        console.log(calculateAllPositions(newBoard, player))
        console.log(calculateAllPositions(newBoard, player).map(x => minimaxWithAlphaBetaPruning(x, depth-2, negInf, posInf, false, getOpponent(player))))
        return calculateAllPositions(newBoard, player).map(x => minimaxWithAlphaBetaPruning(x, depth-1, negInf, posInf, false, getOpponent(player))).reduce((max, x, i, arr) => x > arr[max] ? i : max, 0)
    }
    else
        return calculateAllPositions(newBoard, player).map(x => minimax(x, depth-1, player, false, getOpponent(player))).reduce((max, x, i, arr) => x > arr[max] ? i : max, 0)       
}

// sets the global depth when select is changed
function setDepth(){
    depth = parseInt(document.getElementById("depth").value)
}

// sets if pruning will be on for minimax function
function setPruning(){
    withPruning = parseInt(document.getElementById("pruning").value) == 1 ? true : false
}

// sets user color and restarts game
function setUserColor(){
    userColor = document.getElementById("color").value
    // restart game on change color
    clearScreen()
    startGame(userColor)
}

// sets debugMode()
function setDebugMode(){
    debugMode = parseInt(document.getElementById("debug").value) == 1 ? true : false
}

// begins game and draws inital board
function startGame(player){
    board = calculateLegalMoves(initialBoard, player);
    drawBoard(board, player)
    displayGameState(2, 2, player)
}

// UI button that allows the bot to start the game
function botStartGame(){
    player = getOpponent(userColor)
    board = calculateLegalMoves(initialBoard, player)
    board = playBotMove(board, depth, player)
}

// uses the weights for each square to gauge it's importance
function getPlayerPositions(board, player){
    var playerSquares = []
    for(let row = 0; row < board.length; row++){
        for(let col = 0; col < board[0].length; col++){
            if(board[row][col] == player){
                position = [row, col]
                playerSquares.push(position)
            }
        }
    }
    return playerSquares;
}

// sum the square weights for a players tiles 
function evaluatePositions(positions){
    let total = 0;
    positions.forEach(position => {
        total += squareWeights[position[0]][position[1]]
    })
    return total;
}

function getScore(player, whiteScore, blackScore){
    return player == 'w' ? (whiteScore - blackScore) : (blackScore - whiteScore)
}

function setHeuristic(){
    heuristic = document.getElementById("heuristic").value
}

// Default values, can be changed in UI
var debugMode = false
var withPruning = true
var depth = 6
var userColor = 'b'
var totalEvals = 0
var heuristic = 'score'

var posInf = 1000
var negInf = -1000

// initialize GUI
startGame(userColor)



