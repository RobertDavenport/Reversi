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

/* north, east, south, west, north-east, south-east, south-west, north-west (x,y)*/                    
var adjacentCoordinates = [ [0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1] ];

function calculateLegalMoves(board, player){
    for (row = 0; row < 8; row++) {
        for (column = 0; column < 8; column++){
            if (board[row][column] === ' ') {
                if (isLegalMove(board, row, column, player)){
                    /* if it is a legal move do something */
                    board[row][column] = 'l'
                }
            }
        }
    }
    console.log(board)
    return board
}

function isLegalMove(board, row, column, player){
    if(checkAdjacent(board, row, column, player) && checkLine(board, row, column, player))
        return true;
}

function checkAdjacent(board, row, column, player){
    return adjacentCoordinates.some(coordinate => {
       return checkForOpponent(board, getOpponent(player), row + coordinate[1], column + coordinate[0])
   });
}

function checkLine(board, row, column, player){
    return (adjacentCoordinates.some(direction => {
        /*2x direction to skip*/
        return (checkForPlayer(board, row, column, player, direction[0] + direction[0], direction[1] + direction[1]))
   }));
}

function checkForPlayer(board, row, column, player, x, y){
    /* ignore out of bounds */
    if(row < 0 || row > 7 || column < 0 || column > 7)
        return false;

    else if (board[row][column] == player)
        return true;
    
    else 
        return checkForPlayer(board, row + y, column + x, player, x, y) 
}

function checkForOpponent(board, opponent, x, y){
    /* ignore out of bounds */
    if(x < 0 || x > 7 || y < 0 || y > 7)
        return false;

    /* must be adjacent to opponent piece */   
    else if(board[x][y] == opponent)
        return true;
    
    else
        return false;
}

function playMove(board, player, move){
    adjacentCoordinates.forEach(direction => flipOpponentPieces(board, move[0], move[1], player, direction[0], direction[1]))
    return board;
}

/* fix this */
function flipOpponentPieces(board, row, column, player, x, y){
    /* ignore out of bounds */
    if(row < 0 || row > 7 || column < 0 || column > 7)
        return false;

    if(board[row][column] !== ' ')
        return false;
    
    if(board[row][column] == player)
        return true

    flipOpponentPieces(board, (row + x), (column + y), player, x, y)
        board[row][column] = player  
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

function getPlayerMove(e){
    var row = parseInt(e.getAttribute("data-row"))
    var col = parseInt(e.getAttribute("data-col"))

    board = playMove(board, player, [row,col])
    board = clearLegalMovesFromBoard(board)
    player = getOpponent(player);
    board = calculateLegalMoves(board, player);
    clearScreen()
    drawBoard(board)

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
                legalMove.setAttribute("onclick", 'getPlayerMove(this)')
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



board = initialBoard
board = calculateLegalMoves(board, player);
drawBoard(board)





