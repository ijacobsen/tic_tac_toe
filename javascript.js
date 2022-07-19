/*


- store gameboard as an array inside of a Gameboard
object
    - players store in objects
    - object to control the flow of the game itself

    *** have as little global as possible
    - tuck everything away inside of a module or factory

    *** if only need 1 of something use a module
        - gameBoard
        - displayController
    *** if need multiples of something use factories
        - players

- setup HTML and write JS that will render the contents
of the gameboard array to the webpage

- build the functions that allow players to add marks
to a specific spot on the board, then tie it to the DOM,
letting players click the gameboard to place their
maker.
    *** each piece of functionality should be able to 
    fit in the game, player or gameboad objects


- build logic that checks for when the game is over

- clean up UI to allow players to input their names

- include a button to start/restart the game

- add display element that congratulates the winner

- create an AI to play against

*/


var playButton = document.getElementById('playButton');
playButton.addEventListener('click', playGame);
function playGame() {
    let gC = gameController;
    gC.newGame();
}

var resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetGame);
function resetGame() {
    let board = document.getElementById('board');
    if (board !== null) {
        for (let idx=0; idx<9; idx++) {
            let box = document.querySelector(`#box-${idx}`);
            let text = '';
            box.textContent = text;
        }
    }

    // remove onclicks on boxes

}

// define a player as a factory
const playerFactory = (name) => {
    let symbol = name;
    return {name, symbol}
}

// define a gameBoard as a module
const gameBoard = (() => {

    let board = [
        [null, null, null], 
        [null, null, null], 
        [null, null, null]];

    const emptyBoard = function () {
        board = [
            [null, null, null], 
            [null, null, null], 
            [null, null, null]];
    }

    const markSquare = function (player, position) {
        let row = position[0];
        let col = position[1];
        if (board[row][col] === null) {
            board[row][col] = player.symbol;
        }
    }

    const getSquareVal = function (idx) {
        let row = parseInt((idx/3));
        let col = idx%3;
        let squareVal = board[row][col];
        if (squareVal === null){
            squareVal = '';
        }
        return squareVal;
    }

    const reportBoard = function () {
        console.log('=====================')
        console.log(board);
    }

    const checkEnd = function() {

        // check horizontal lines
        for (let i=0; i<3; i++){
            if (board[i][0] !== null){
                if (board[i][0] === board[i][1]) {
                    if (board[i][0] === board[i][2]) {
                        let winner = board[i][0];
                        if (winner !== null) {
                            return winner;
                        }
                    }
                }
            }
        }

        // check vertical lines
        for (let i=0; i<3; i++){
            if (board[0][i] !== null){
                if (board[0][i] === board[1][i]) {
                    if (board[0][i] === board[2][i]) {
                        let winner = board[0][i];
                        if (winner !== null) {
                            return winner;
                        }
                    }
                }
            }
        }

        // check diagonal lines
        if (board[1][1] !== null){

            if (board[0][0] === board[1][1]){
                if (board[0][0] === board[2][2]){
                    let winner = board[0][0];
                    if (winner !== ''){
                        return winner;
                    }
                }
            }

            if (board[0][2] === board[1][1]){
                if (board[0][2] === board[2][0]){
                    let winner = board[0][2];
                    if (winner !== ''){
                        return winner;
                    }
                }
            }
        }


        return '';

    }

    return {emptyBoard, markSquare, getSquareVal, reportBoard, checkEnd}
})();

// define a displayController as a module
const displayController = (() => {

    // init board
    let board = document.createElement('div');
    board.setAttribute('id', 'board');
    for (let i=0; i<9; i++) {
        let box = document.createElement('div');
        box.setAttribute('class', 'box');
        box.setAttribute('id', `box-${i}`);
        box.textContent = '';
        board.appendChild(box);
    }
    let page = document.querySelector('.page');
    page.appendChild(board);

    // update board
    const renderBoard = function (gBoard) {
        for (let idx=0; idx<9; idx++) {
            let box = document.querySelector(`#box-${idx}`);
            let text = gBoard.getSquareVal(idx);
            box.textContent = text;
        }
    }

    return {renderBoard}
})();

// define gameController
const gameController = (() => {

    // render empty gameboard (model)
    let gBoard = gameBoard;

    // render a display controller (view)
    let dController = displayController;

    // start game
    const newGame = function () {

        // get player 1 name
        let p_1_name = 'joe';
        let p_1 = playerFactory(p_1_name);

        // get player 2 name
        let p_2_name = 'mary'
        let p_2 = playerFactory(p_2_name);
    
        // reset gameboard
        gBoard.emptyBoard();

        // play round
        let winner = playRound(p_1, p_2, gBoard, dController);

        // display game winner
        if (winner != null){
            console.log(`${winner.name} wins!`);
        }
        else {
            console.log('its a tie');
        }

    }

    // play a round
    const playRound = function (p_1, p_2, gBoard, dController) {

        let curr_player = null;

        var box = document.querySelectorAll(".box");
        box.forEach(function(element) {
            element.onclick = function() {
                alert(curr_player.name + ' is choosing ' + this.id);
        }});

        const makeMove = function(obj) {
            let move = window.prompt(obj.player.name + ', whats your move? x,y', '');
            obj.board.markSquare(obj.player, [move[0], move.slice(-1)]);
            obj.display.renderBoard(obj.board);
        }

        let checkResult = null;
        let obj = null;

        for (let i=0; i<9; i++) {

            // player 1 move
            obj = {player: p_1, board: gBoard, display: dController};
            makeMove(obj);
        
            // check if game over
            checkResult = gBoard.checkEnd();
            if (checkResult !== '') {
                return p_1;
            }

            // player 2 move
            obj = {player: p_2, board: gBoard, display: dController};
            makeMove(obj);
        
            // check if game over
            checkResult = gBoard.checkEnd();
            if (checkResult !== '') {
                return p_2;
            }

        }

        // if no one won then return a tie
        return null;

    }

    // public members
    return {newGame}
})();

