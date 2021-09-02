// TODO: find/replace all (this.state.?)squares[row][col] with getTileValue(row, col) or setTileValue

import React from 'react';
import './App.css';

class PlayerTiles extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    this.props.handlePlayerTileClick(i);
  }

  render() {
    let backgroundColor;
    return (
      <div>
        {this.props.tiles.map((tile, i) => {
          backgroundColor = (i === this.props.selectedPlayerTileIdx) ? 'green' : '';
          return (
            this.props.renderSquare(i, tile, backgroundColor, () => this.handleClick(i))
          )
        })}
      </div>
    )
  }
}

function Square(props) {
  return (
    <input
      type="button"
      value={props.value}
      onClick={props.onClick}
      style={{ backgroundColor: props.backgroundColor }}
      className="square"/>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    this.props.handleSquareClick(i);
  }

  render() {
    let boardRows = [];
    let key = 0;
    for (let r = 0; r < 15; r++) {
      let squareElements = [];
      for (let c = 0; c < 15; c++) {
        const value = this.props.squares[r][c];
        let i = 15 * r + c;
        let backgroundColor = (i === this.props.selectedBoardIdx) ? 'green' : '';
        squareElements.push(this.props.renderSquare(i, value, backgroundColor, () => this.handleClick(i)));
      }
      boardRows.push(
      <div key={key} className="board-row">
        {squareElements}
      </div>
      )
      key++;
    }

    return (
      <div>
        {boardRows}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    // Initializes new board
    const squares = new Array(15);
    for (var i = 0; i < squares.length; i++) {
      squares[i] = new Array(15).fill('');
    }

    // var word = ['F', 'L', 'A', 'N', 'K'];
    // var col = 5;
    // for (let i = 7; i < 12; i++) {
    //   squares[i][col] = word[i-7];
    // }

    // var col = 7;
    // var word = ['D', 'R', 'E', 'S', 'S'];
    // for (let i = 5; i < 10; i++) {
    //   squares[i][col] = word[i-5];
    // }

    super(props);
    this.state = {
      squares: squares,
      words: {valid: [], invalid: []},
      points: null,
      playerOneIsNext: true,
      playerOneScore: 0,
      playerTwoScore: 0,
      playerOneTiles: ['O', 'A', 'D', 'F', 'M', 'A', ''],
      newTiles: [],
      newTileOrientation: '',
      selectedPlayerTileIdx: null,
      selectedBoardIdx: null,
      error: null
      // TODO. getNewTile will modify this.
      // tileBank:
    }
    this.handlePlayerTileClick = this.handlePlayerTileClick.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
  }

  // [[[2, 3], [3, 3], [4, 3]], [[3, 3], [4, 3]]] -> ['hey', 'hi']
  displayWords(words) {
    const display = [];
    for (let tiles of words) {
      var word = '';
      for (let tile of tiles) {
        let [row, col] = tile;
        word += this.getTileValue(row, col);
      }
      display.push(word);
    }
    return display;
  }

  // Returns the letter at (row, col) if it exists on the board. Returns an empty string if it does not, or if the coords are out of bounds.
  getTileValue(row, col) {
    return this.state.squares[row][col];
  }

  // Returns (row, col) corresponding to i on the board.
  getCoords(i) {
    return [Math.floor(i / 15), i % 15];
  }

  handleSquareClick(i) {
    const squares = this.state.squares;
    const [row, col] = this.getCoords(i);
    const tile = squares[row][col];
    const selectedPlayerTileIdx = this.state.selectedPlayerTileIdx;
    const selectedBoardIdx = this.state.selectedBoardIdx;
    if (tile === '') {
      if (selectedPlayerTileIdx !== null) {
        const playerOneTiles = this.state.playerOneTiles;
        squares[row][col] = playerOneTiles[selectedPlayerTileIdx];
        playerOneTiles[selectedPlayerTileIdx] = '';
        const newTiles = this.state.newTiles.concat([[row, col]]);
        const newTileOrientation = this.getOrientation(newTiles);
        const wordTiles = this.getWords(newTiles, newTileOrientation);
        const words = this.validateWords(wordTiles);
        const points = this.getPoints(words.valid);
        this.setState({
          squares: squares,
          playerOneTiles: playerOneTiles,
          selectedPlayerTileIdx: null,
          newTiles: newTiles,
          newTileOrientation: newTileOrientation,
          words: words,
          points: points
        })
      }
      else if (selectedBoardIdx !== null) {
        const [prevRow, prevCol] = this.getCoords(selectedBoardIdx);
        squares[row][col] = this.getTileValue(prevRow, prevCol);
        squares[prevRow][prevCol] = '';
        const newTiles = this.state.newTiles.map(tile => (
          tile[0] === prevRow && tile[1] === prevCol ? [row, col] : tile)
        )
        const newTileOrientation = this.getOrientation(newTiles);
        const wordTiles = this.getWords(newTiles, newTileOrientation);
        const words = this.validateWords(wordTiles);
        const points = this.getPoints(words.valid);
        this.setState({
          squares: squares,
          selectedBoardIdx: null,
          newTiles: newTiles,
          newTileOrientation: newTileOrientation,
          words: words,
          points: points
        })
      }
    }
    else {
      if (i === selectedBoardIdx) {
        this.setState({
          selectedBoardIdx: null
        })
      }
      else {
        this.setState({
          selectedBoardIdx: i,
          selectedPlayerTileIdx: null
        })
      }
    }
  }

  handlePlayerTileClick(i) {
    const playerOneTiles = this.state.playerOneTiles;
    const selectedPlayerTileIdx = this.state.selectedPlayerTileIdx;
    const selectedBoardIdx = this.state.selectedBoardIdx;
    const squares = this.state.squares;
    if (playerOneTiles[i] !== '') {
      if (selectedPlayerTileIdx === i) {
        this.setState({
          selectedPlayerTileIdx: null
        })
      }
      else {
        this.setState({
          selectedPlayerTileIdx: i,
          selectedBoardIdx: null
        })
      }
    }
    else {
      if (selectedBoardIdx !== null) {
        const [prevRow, prevCol] = this.getCoords(selectedBoardIdx);
        playerOneTiles[i] = this.getTileValue(prevRow, prevCol);
        squares[prevRow][prevCol] = '';
        const newTiles = this.state.newTiles.filter(tile => tile[0] !== prevRow || tile[1] !== prevCol);
        const wordTiles = this.getWords(newTiles, this.state.newTileOrientation);
        const words = this.validateWords(wordTiles);
        const points = this.getPoints(words.valid);
        this.setState({
          squares: squares,
          playerOneTiles: playerOneTiles,
          selectedBoardIdx: null,
          newTiles: newTiles,
          words: words,
          points: points
        })
      }
      else if (selectedPlayerTileIdx !== null) {
        this.setState({
          selectedPlayerTileIdx: null
        })
      }
    }
  }

  renderSquare(i, value, backgroundColor, handleClick) {
    return (
      <Square
        key={i}
        onClick={handleClick}
        backgroundColor={backgroundColor}
        value={value}/>
    )
  }

  getTilePoints(tile) {
    const [row, col] = tile;
    const tileValue = this.getTileValue(row, col);
    return this.props.tilePoints[tileValue];
  }

  // Input: valid words, e.g. (note 3 layers) [[[2, 3], [3, 3], [4, 3]], [[2, 4], [3, 4]]]
  getPoints(words) {
    var points = 0;
    for (let tiles of words) {
      for (let tile of tiles) {
        points += this.getTilePoints(tile);
      }
    }
    return points;
  }

  isValidWord(word) {
    const prefix = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
    const suffix = "?key=5c251dad-fd1e-4086-8671-92278466dd21";
    const link = prefix + word + suffix;
    fetch(link)
      .then(res => res.json())
      .then(
        (result) => {
          if (result[0].constructor !== Object) {
            return false;
          }
          else {
            return true;
          }
        },
        (error) => {
          this.setState({
            error
          });
        }
      )
  }

  // Output e.g. {valid: [[]], invalid: [[[4, 3], [3, 3], [2, 3]], [[2, 2], [2, 3]]] (note three layers of arrays)
  validateWords(words) {
    const validate = {valid: [], invalid: []};
    const display = this.displayWords(words);

    for (let i = 0; i < display.length; i++) {
      const word = display[0];
      this.isValidWord(word) ? validate.valid.push(words[i]) : validate.invalid.push(words[i]);
    }
    return validate
  }

  getWord(tiles, orientation) {
    var word = [];
    var [row, col] = tiles[0];
    if (orientation === 'horizontal') {
      if (this.getWestNeighbor(row, col) === '' && this.getEastNeighbor(row, col) === '') {
        return null;
      }
      var westNeighbor = this.getWestNeighbor(row, col);
      while (westNeighbor !== '') {
        col -= 1;
        word.unshift([row, col]);
        westNeighbor = this.getWestNeighbor(row, col);      
      }
      word = word.concat(tiles);
      [row, col] = tiles[tiles.length - 1];
      var eastNeighbor = this.getEastNeighbor(row, col);
      while (eastNeighbor !== '') {
        col += 1;
        word.concat([row, col]);
        eastNeighbor = this.getEastNeighbor(row, col);
      }
    }
    else {
      if (this.getNorthNeighbor(row, col) === '' && this.getSouthNeighbor(row, col) === '') {
        return null;
      }
      var northNeighbor = this.getNorthNeighbor(row, col);
      while (northNeighbor !== '') {
        row -= 1;
        word.unshift([row, col]);
        northNeighbor = this.getNorthNeighbor(row, col);      
      }
      word = word.concat(tiles);
      [row, col] = tiles[tiles.length - 1];
      var southNeighbor = this.getSouthNeighbor(row, col);
      while (southNeighbor !== '') {
        col += 1;
        word.concat([row, col]);
        southNeighbor = this.getSouthNeighbor(row, col);
      }
    }
    return word;
  }

  // Example: [[3, 3], [3, 4], [3, 2]] -> [[2, 3], [3, 3], [4, 3]]
  sortTiles(tiles, orientation) {
    var sortedTiles = [];
    if (orientation === 'horizontal') {
      const row = tiles[0][0];
      const cols = tiles.map(tile => tile[1]);
      const sortedCols = cols.sort();
      sortedTiles = sortedCols.map(col => [row, col]);
    }
    // TODO
    // else {

    // }
    return sortedTiles;
  }

  // Returns an array that corresponds to each word that is connected to tiles, both verically and horizontally.
  getWords(tiles, orientation) {
    if (tiles.length === 1) {
      return [];
    }

    const words = [];
    const sortedTiles = this.sortTiles(tiles, orientation);
    const wordAlongOrientation = this.getWord(sortedTiles, orientation);
    words.push(wordAlongOrientation);

    const newOrientation = (orientation === 'horizontal') ? 'vertical' : 'horizontal';
    for (let tile of tiles) {
      let word = this.getWord([tile], newOrientation);
      if (word !== null) {
        words.push(word);
      }
    }
    return words
  }

  // Returns true if there aren't any blank spaces between tiles, and false otherwise.
  // Input: tiles, which are all in a straight line, and orientation = 'horizontal' or 'vertical'.
  hasNoBlankSpaces(tiles, orientation) {
    const idxDirection = orientation === 'horizontal' ? 1 : 0;
    const idxs = tiles.map(tile => tile[idxDirection]);
    const max = Math.max.apply(Math, idxs);
    const min = Math.min.apply(Math, idxs);

    if (orientation === 'horizontal') {
      const row = tiles[0][0];
      for (let i = min; i <= max; i++) {
        if (!this.getTileValue(row, i) && !idxs.includes(i)) {
          return false;
        }
      }
    }
    else if (orientation === 'vertical') {
      const col = tiles[0][1];
      for (let i = min; i <= max; i++) {
        if (!this.getTileValue(i, col) && !idxs.includes(i)) {
          return false;
        }
      }
    }
    return true;
  }

  getWestNeighbor(row, col) {
    return this.getTileValue(row, col - 1);
  }

  getEastNeighbor(row, col) {
    return this.getTileValue(row, col + 1);
  }

  getNorthNeighbor(row, col) {
    return this.getTileValue(row - 1, col);
  }

  getSouthNeighbor(row, col) {
    return this.getTileValue(row + 1, col);
  }

  // Returns true if (row, col) has a neighbor in a cardinal direction that is already on the board.
  hasNeighbor(row, col) {
    if (this.getNorthNeighbor(row, col) || this.getEastNeighbor(row, col) || this.getSouthNeighbor(row, col) || this.getWestNeighbor(row, col)) {
      return true;
    }
    return false;
  }

  // Returns true if any of the new tiles are touching an old tile in any of the cardinal directions (N, S, E, W).
  isTouchingOldTile(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      let [row, col] = tiles[i];
      if (this.hasNeighbor(row, col)) {
        return true;
      }
    }
    return false;
  }

  // tiles: Array of two-element arrays that each contain (row, col) int pairs
  // e.g. [[2, 1], [13, 14], [6, 6]]
  // Returns a two-element array:
  // orientation: 'vertical'/'horizontal' if straight, empty string if not. horizontal if there is just one tile.
  getOrientation(tiles) {
    let [firstTileRow, firstTileCol] = tiles[0];
    let [isHorizontal, isVertical] = [true, true];
    for (let i = 1; i < tiles.length; i++) {
      let [row, col] = tiles[i];
      if (row !== firstTileRow) {
        isHorizontal = false;
      }
      if (col !== firstTileCol) {
        isVertical = false;
      }
    }
    if (isHorizontal || isVertical) {
      return isHorizontal ? 'horizontal' : 'vertical';
    }
    else {
      return '';
    }
  }

  render() {
    const newTiles = this.state.newTiles;
    const centerTile = this.getTileValue(7, 7);
    const isFirstTurn = this.state.playerOneScore === 0 && this.state.playerTwoScore === 0;
    const newTileOrientation = this.state.newTileOrientation;
    const words = this.state.words;
    const error = this.state.error;

    let desc;
    if (error !== null) {
      desc = error;
    }

    else if (newTiles.length === 0) {
      desc = "90 letters left";
    }

    else if (centerTile === '' && isFirstTurn) {
      if (newTiles.length > 0) {
        desc = "Center tile needs to be occupied";
      }
    }

    else if (centerTile !== '' && newTiles.length === 1) {
      desc = "One word tile not allowed";
    }

    else if (newTileOrientation === '') {
      desc = "Tiles need to be in a straight line";
    }

    else if (!isFirstTurn && this.isTouchingOldTile(newTiles)) {
      desc = "New tiles need to touch old tiles";
    }

    else if (!this.hasNoBlankSpaces(newTiles, newTileOrientation)) {
      desc = "No spaces allowed between tiles";
    }

    else if (words.invalid.length > 0) {
      const invalidWords = this.displayWords(words.invalid);
      desc = "Invalid words:" + invalidWords.map(w => ' ' + w);
    }
    
    else {
      desc = "Points: " + this.state.points.toString();
    }
    
    return (
      <div>
        <div>
          <Board
            squares={this.state.squares}
            renderSquare={this.renderSquare}
            selectedBoardIdx={this.state.selectedBoardIdx}
            playerOneTiles = {this.state.playerOneTiles}
            handleSquareClick={this.handleSquareClick}/>
        </div>
        <p>
          {desc}
        </p>
        <div>
          <div>
            <PlayerTiles
              tiles={this.state.playerOneTiles}
              handlePlayerTileClick={this.handlePlayerTileClick}
              renderSquare={this.renderSquare}
              selectedPlayerTileIdx={this.state.selectedPlayerTileIdx}/>
          </div>
          <br></br>
          <br></br>
          <div>
            <input type="button" value="Play"></input>
          </div>
          <p>Player 1: 0 points</p>
          <p>Player 2: 0 points</p>
        </div>
      </div>
    )
  }
}


// class Game extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       error: null,
//       isLoaded: false,
//       items: []
//     };
//     this.handleClick = this.handleClick.bind(this);
//   }

//   handleClick() {
//     fetch("https://www.dictionaryapi.com/api/v3/references/collegiate/json/volzuminous?key=5c251dad-fd1e-4086-8671-92278466dd21")
//       .then(res => res.json())
//       .then(
//         (result) => {
//           if (result[0].constructor !== Object) {
//             alert(result);
//           }
//           else {
//             this.setState({
//               isLoaded: true,
//               item: result[0].meta.id
//             });
//           }
//         },
//         // Note: it's important to handle errors here
//         // instead of a catch() block so that we don't swallow
//         // exceptions from actual bugs in components.
//         (error) => {
//           this.setState({
//             isLoaded: true,
//             error
//           });
//         }
//       )
//   }

//   render() {
//     const { error, isLoaded, items } = this.state;
//     if (error) {
//       return <div>Error: {error.message}</div>;
//     } else if (!isLoaded) {
//       return (
//         <div>
//           <div>
//             <input type="button" value="Button" onClick={this.handleClick} />
//           </div>
//           <div>
//             "Loading..."
//           </div>
//         </div>
//       )
//     } else {
//       return (
//         <div>
//           <div>
//             <input type="button" value="Button" onClick={this.handleClick} />
//           </div>
//           <div>
//             {this.state.item}
//           </div>
//         </div>
//       );
//     }
//   }
// }

export default Game;