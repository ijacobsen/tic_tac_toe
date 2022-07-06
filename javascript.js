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



// define a gameBoard as a module
const gameBoard = (() => {
    let board = [
        [null, null, null], 
        [null, null, null], 
        [null, null, null]];

    const markSquare = function (player, position) {
        let row = position[0];
        let col = position[1];
        console.log(board[row][col]);
        if (board[row][col] === null) {
            board[row][col] = player.symbol;
        }
        console.log(board);
    }
    return {markSquare}
})();

// define a displayController as a module

// define a player as a factory
const playerFactory = (name) => {
    let symbol = name;
    return {name, symbol}
}

/*
let joe = playerFactory('joe');
let board = gameBoard;
gameBoard.markSquare(joe, [0, 0]);
*/