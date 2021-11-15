var player = 'b';

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

var lmDebugBoard =  [   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', 'b', ' ', ' ', 'w', ' ', ' '],
                        [' ', ' ', ' ', 'b', 'w', ' ', ' ', ' '],
                        [' ', ' ', ' ', 'w', 'b', ' ', ' ', ' '],
                        [' ', ' ', ' ', 'w', 'b', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
                    ];

/* north, east, south, west, north-east, south-east, south-west, north-west (x,y)*/                    
var adjacentCoordinates = [ [0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1] ];

function calculateLegalMoves(board, player){
    let currentBoard = copy2DArray(board) 
    for (row = 0; row < 8; row++) {
        for (column = 0; column < 8; column++){
            if (board[row][column] === ' ') {
                if (isLegalMove(board, row, column, player)){
                    /* if it is a legal move do something */
                    currentBoard[row][column] = 'l'
                }
            }
        }
    }
    return currentBoard
}

function isLegalMove(board, row, column, player){
    if(checkAdjacent(board, row, column, player))
        return true;
}

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

function checkForOpponent(board, opponent, row, column, x, y){
    /* ignore out of bounds */
    if(row + y < 0 || row + y > 7 || column + x < 0 || column + x > 7)
        return false;

    /* must be adjacent to opponent piece */   
    else if(board[row + y][column + x] == opponent){
        // see if player has a tile in this line
        if(checkForPlayer(board, row+y, column+x, getOpponent(opponent), x, y))
            return true;
    }
    
    else
        return false;
}

function checkForPlayer(board, row, column, player, x, y){
    /* ignore out of bounds for this move */
    if(row < 0 || row > 7 || column < 0 || column > 7)
        return false;

    /* ignore out of bounds for next move */
    if(row + y < 0 || row + y > 7 || column + x < 0 || column + x > 7)
        return false;
    
    if (board[row][column] == ' ')
        return false
    
    if (board[row][column] == 'l')
        return false
    
    if (board[row][column] == player)
        return true;

    return checkForPlayer(board, row + y, column + x, player, x, y) 
}

function playMove(board, player, move){
    let currentBoard = copy2DArray(board)
    // flip current piece since it is a known legal move
    currentBoard[move[0]][move[1]] = player
    // attempt to flip opponents pieces recursively in all directions
    adjacentCoordinates.forEach(direction => flipOpponentPieces(currentBoard, move[0]+direction[0], move[1]+direction[1], player, direction[0], direction[1]))
    return currentBoard;
}


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

function getOpponent(player){
    return (player == 'w') ? 'b' : 'w';
}

function clearLegalMovesFromBoard(board){
    for(i=0; i<board.length; i++){
        for(j=0; j<board[0].length; j++){
            if(board[i][j] == 'l')
                board[i][j] = ' '
        }
    }
    return board;
}

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

function calculateBoardState(board){
    var black = 0;
    var white = 0;
    var legal = 0;
    var avail = 0;
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

function handlePlayerMove(e){
    var row = parseInt(e.getAttribute("data-row"))
    var col = parseInt(e.getAttribute("data-col"))

    // safegaurd that the player is black
    player = 'b'  
    board = playMove(board, player, [row, col])

    // change player and refresh board
    player = getOpponent(player)
    board = prepareBoard(board, player)
    // if no legal moves for player, opponent turn
    if (countLegalMoves(board) == 0){
        // change player and refresh board
        player = getOpponent(player)
        board = prepareBoard(board, player)
        // neither player or bot have a move
        if (countLegalMoves(board) == 0)
            endGame(board)
        else
            board = playBotMove(board, depth, player)
            return;
    }
    // no more available moves
    // if (boardState[3] + boardState[2] == 0)
    //     endGame(board)

    drawGUI(board, player)
    sleep(1000).then(() => {
        board = playBotMove(board, depth, player)
    }); 
}

function drawGUI(board){
    const [blackScore, whiteScore, legalMoves, availMoves] = calculateBoardState(board)
    clearScreen()
    drawBoard(board)
    displayGameState(blackScore, whiteScore, player)
}

function prepareBoard(board, player){
    freshBoard = copy2DArray(board)
    freshBoard = clearLegalMovesFromBoard(freshBoard)
    freshBoard = calculateLegalMoves(freshBoard, player);
    return freshBoard
}

function playBotMove(board, depth, player){
    botMoveIndex = getBotMove(board, depth, player)
    positions = calculateAllPositions(board, player)
    board = positions[botMoveIndex]
    clearScreen()
    drawBoard(board)
    player = getOpponent(player)
    const [black, white, legal, avail] = calculateBoardState(board)
    displayGameState(black, white, player)

    // must handle the player having no moves here since they will not have a button to press
    // bot will continue to play if opponent has 0 legal moves
    if (legal == 0){
        player = getOpponent(player)
        playBotMove(board, depth, player)
    }    
    return board;
    
}

// this was needed for very low depths because bot was playing instantly
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function clearScreen(){
    document.getElementById("container").remove();
}

function drawBoard(board){

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
            if (board[row][col] == 'l'){
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

function displayGameState(blackScore, whiteScore, player){
    let blackDisplay = document.getElementById('blackScore')
    let whiteDisplay = document.getElementById('whiteScore')
    let playerDisplay = document.getElementById('currentPlayer')
    blackDisplay.innerHTML = blackScore
    whiteDisplay.innerHTML = whiteScore
    playerDisplay.innerHTML = (player == 'b') ? 'black' : 'white'
}

function endGame(board){
    let [blackScore, whiteScore, legalMoves, availMoves] = calculateBoardState(board)
    var winner = document.getElementById('winner')
    var winnerLabel = document.getElementById('winnerLabel')
    winner.innerHTML = (Math.max(blackScore, whiteScore) == blackScore) ? 'BLACK!!' : 'WHITE!!'
    winner.classList.remove('display-none')
    winnerLabel.classList.remove('display-none')
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

function minimax(board, depth, player, maximizingPlayer){
    const [blackScore, whiteScore, legalMoves, availMoves] = calculateBoardState(board)
    if (depth == 0 || (legalMoves + availMoves) == 0)
        return legalMoves
    
    allPostions = calculateAllPositions(board)

    if (maximizingPlayer){
        maxEval = negInf
        calculateAllPositions(board, player).forEach(position => {
            eval = minimax(position, depth-1, getOpponent(player), false)
            maxEval = Math.max(maxEval, eval)          
        });
        return maxEval;
    }
    else {
        minEval = posInf
        calculateAllPositions(board, player).forEach(position => {
            eval = minimax(position, depth-1, player, true)
            minEval = Math.min(minEval, eval)
        });
        return minEval
    }
}

function minimaxWithAlphaBetaPruning(board, depth, alpha, beta, maximizingPlayer, player){
    const [blackScore, whiteScore, legalMoves, availMoves] = calculateBoardState(board)
    if (depth == 0 || (legalMoves + availMoves) == 0){
        return legalMoves
    }     

    if (maximizingPlayer){
        maxEval = negInf
        calculateAllPositions(board, player).some(child => {
            eval = minimaxWithAlphaBetaPruning(child, depth-1, alpha, beta, false, getOpponent(player))
            maxEval = Math.max(maxEval, eval)
            alpha = Math.max(alpha, eval)
            if ( beta <= alpha)
                return true;
        });
        return maxEval
    }
    else {
        minEval = posInf
        calculateAllPositions(board, player).some(child => {
            eval = minimaxWithAlphaBetaPruning(child, depth-1, alpha, beta, true, getOpponent(player))
            minEval = Math.min(minEval, eval)
            beta = Math.min(beta, eval)
            if (beta <= alpha)
                return true;
        });
        return minEval
    }
}

function copy2DArray(array){
    return array.map(x => [...x]);
}

// Returns the index of the best Board from the minimax Algorithim
function getBotMove(board, depth, player){
    let newBoard = copy2DArray(board)
    if (withPruning)
        return calculateAllPositions(newBoard, player).map(x => minimaxWithAlphaBetaPruning(x, depth, negInf, posInf, true, getOpponent(player))).reduce((max, x, i, arr) => x > arr[max] ? i : max, 0)
    else 
        return calculateAllPositions(newBoard, player).map(x => minimax(x, depth, player, true, getOpponent(player))).reduce((max, x, i, arr) => x > arr[max] ? i : max, 0)
}

function setDepth(){
    // sets the global depth when select is changed
    depth = parseInt(document.getElementById("depth").value)
}

function setPruning(){
    withPruning = parseInt(document.getElementById("depth").value) == 1 ? true : false
}

// Default values
var withPruning = true
var depth = 6
var posInf = 1000
var negInf = -1000
board = calculateLegalMoves(initialBoard, player);
// initialize GUI
drawBoard(board)
displayGameState(2, 2, player)
//let newBoard = copy2DArray(board)



