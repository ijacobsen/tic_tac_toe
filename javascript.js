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



var playButton = document.getElementById('playerNames');
playButton.addEventListener('submit', function(e) {
    
    e.preventDefault();

    // read player names
    const data = new FormData(playButton);
    console.log(data);
    let p_1_name = data.get('p1_name');
    if (p_1_name === '') {
        p_1_name = 'Player One';
    }
    let p_2_name = data.get('p2_name');
    if (p_2_name === '') {
        p_2_name = 'Player Two';
    }

    // start game
    let gC = gameController;
    gC.newGame(p_1_name, p_2_name);

})

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
        let winnerPanel = document.getElementById('winnerPanel');
        winnerPanel.textContent = '';
    }
}

// define a player as a factory
const playerFactory = (name, symbol) => {
    return {name, symbol}
}

// define a gameBoard as a module
const gameBoard = (() => {

    let board = [
        [null, null, null], 
        [null, null, null], 
        [null, null, null]];

    const emptyBoard = function () {

        // empty the board
        board = [
            [null, null, null], 
            [null, null, null], 
            [null, null, null]];
    }

    const markSquare = function (player, position) {
        let row = parseInt((position/3));
        let col = position%3;
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
                    if (winner !== null){
                        return winner;
                    }
                }
            }

            if (board[0][2] === board[1][1]){
                if (board[0][2] === board[2][0]){
                    let winner = board[0][2];
                    if (winner !== null){
                        return winner;
                    }
                }
            }
        }


        return null;

    }

    return {emptyBoard, markSquare, getSquareVal, reportBoard, checkEnd}
})();

// define a displayController as a module
const displayController = (() => {

    // init board
   let board = document.getElementById('board');
    for (let i=0; i<9; i++) {
        let box = document.createElement('div');
        box.setAttribute('class', 'box');
        box.setAttribute('id', `box-${i}`);
        box.textContent = '';
        board.appendChild(box);
    }

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
    const newGame = function (p_1_name, p_2_name) {

        // read player names form

        // get player 1 name
        let p_1 = playerFactory(p_1_name, 'X');

        // get player 2 name
        let p_2 = playerFactory(p_2_name, 'O');
    
        // reset gameboard
        gBoard.emptyBoard();

        // play round
        playRound(p_1, p_2, gBoard, dController);

    }

    // play a round
    const playRound = function (p_1, p_2, gBoard, dController) {

        const roundLogic = function(playerSelection){

            // determine player turn
            if (counter % 2 === 0) {
                curr_player = p_1;
            }
            else {
                curr_player = p_2;
            }

            // mark square
            gBoard.markSquare(curr_player, playerSelection);

            // increment counter
            counter++;
        
            // render board
            dController.renderBoard(gBoard);

            // check if game over
            checkResult = gBoard.checkEnd();
            if (checkResult !== null) {
                winner = curr_player;
                console.log(`${winner.name} wins!`)
                return winner;
            }
            else if (counter == 9) {
                console.log('its a tie');
                return '';
            }
            else {
                return null;
            }
        }


        var box = document.querySelectorAll(".box");
        box.forEach(function(element) {
            element.onclick = function() {

                // get players selection
                let box_id = this.id.slice(-1);

                // check if selection is valid (ie empty)
                if (gBoard.getSquareVal(box_id) === ''){

                    // store selection
                    playerSelection = box_id;

                    // run logic
                    let result = roundLogic(box_id)

                    // check if game is over
                    console.log(result);
                    if (result !== null){

                        // determine text to display
                        if (result === ''){
                            var displayText = "It's a Tie!";
                        }
                        else {
                            var displayText = `${result.name} wins!`;
                        }

                        // render winner result on page
                        let winnerPanel = document.getElementById('winnerPanel');
                        winnerPanel.textContent = displayText;

                        // finish game by filling in all unused spaces
                        for (let i=0; i<9; i++){
                            gBoard.markSquare(p_1, i);
                        }

                    }
                }
        }});

        var counter = 0;
        var playerSelection = null;
        var curr_player = null;
        let winner = null;

    }

    // public members
    return {newGame}
})();

