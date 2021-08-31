import React from 'react';
import './App.css';

// Game: Contains the entirety of the project
// 	Board: Renders a 15x15 grid of Squares
// 		Square: Renders a single button
// 	PlayerTiles: Renders a button for each of the user’s tiles

function Square(props) {
  return (
    <input
      type="button"
      value={props.value}
      // onClick={props.onClick}
      className="square"/>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        onClick={() => this.handleClick(i)}
        value={this.props.squares[i]}/>
    )
  }

  render() {
    let boardRows = [];
    let i = 0;
    for (let r = 0; r < 15; r++) {
      let squareElements = [];
      for (let c = 0; c < 15; c++) {
        squareElements.push(this.renderSquare(i));
        i++;
      }
      boardRows.push(
        <div key={i} className="board-row">
          {squareElements}
        </div>
      )
    }

    return (
      <div>
        {boardRows}
      </div>
    )
  }
}

class Game extends React.Component {
  render() {
    const emptyBoard = new Array(15);
    for (var i = 0; i < emptyBoard.length; i++) {
      emptyBoard[i] = new Array(15).fill('');
    }

    // const LETTERS = ['B', 'D', 'E', 'F', 'Y', 'A', 'R'];

    return (
      <Board 
        squares={emptyBoard}
      />
    )
  }
}

// const LETTERS = {
//   'A': {
//     'value': 1,
//     'count': 9
//   },
//   'B': {
//     'value': 3,
//     'count': 2
//   }
// }

export default Game;