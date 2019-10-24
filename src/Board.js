import React, {Component} from 'react';
import Square from "./Square.js";
import winningConditions from './winningConditions.js';
import playerPieces from './playerPieces.js';
import characters from "./characters.js";
import './App.css';
import Dropdown from './Dropdown.js';
import blank from "./blank.png";
import arya from "./faces/arya.png";
import bran from "./faces/bran.png";
import brienne from "./faces/brienne.png";
import cersei from "./faces/cersei.png";
import daenerys from "./faces/daenerys.png";
import davos from "./faces/davos.png";
import euron from "./faces/euron.png";
import greyWorm from "./faces/greyWorm.png";
import hound from "./faces/hound.png";
import jamie from "./faces/jamie.png";
import jonSnow from "./faces/jonSnow.png";
import jorah from "./faces/jorah.png";
import melisandre from "./faces/melisandre.png";
import missandei from "./faces/missandei.png";
import nightKing from "./faces/nightKing.png";
import samwell from "./faces/samwell.png";
import sansa from "./faces/sansa.png";
import theon from "./faces/theon.png";
import tyrion from "./faces/tyrion.png";
import varys from "./faces/varys.png";
import theme from "./theme.mp3";
const audio  = new Audio(theme);
const fillArray = Array(100).fill(null);

class Board extends Component {

  constructor(props){
    super(props)
    this.state = {
      squares: Array(100).fill(null),
      firstPlayer : {
        pieces: playerPieces[0],
        won : false,
        character: characters[0],
        wins: 0,
        currentPiece: 0
      },
      secondPlayer : {
        pieces: playerPieces[1],
        won : false,
        character: characters[1],
        wins: 0
      },
      ai: {
        guesses: [],
        hits: [],
        hitDirection: ""
      },
      showingBoard1: true,
      placingPiece: false,
      musicPlaying: false,
      firstPlayerTurn : true,
      gameOver: false,
      gameStarted: false
    }
  }

  getPicture = (character) => {
    switch(character){
      case "Arya Stark":
        return arya;
      case "Bran Stark":
        return bran;
      case "Brienne of Tarth":
        return brienne;
      case "Cersei Lannister":
        return cersei;
      case "Daenerys Targaryean":
        return daenerys;
      case "Davos Seaworth":
        return davos;
      case "Euron Greyjoy":
        return euron;
      case "Grey Worm":
        return greyWorm;
      case "The Hound":
        return hound;
      case "Jamie Lannister":
        return jamie;
      case "Jon Snow":
        return jonSnow;
      case "Jorah Mormont":
        return jorah;
      case "Melisandre":
        return melisandre;
      case "Missandei":
        return missandei;
      case "Night King":
        return nightKing;
      case "Samwell Tarly":
        return samwell;
      case "Sansa Stark":
        return sansa;
      case "Theon Greyjoy":
        return theon;
      case "Tyrion Lannister":
        return tyrion;
      case "Varys":
        return varys;
    }
    return jonSnow;
  }

  checkIfWinner = () =>{

  }

  handleClick = (id) => {
    let {gameStarted, placingPiece, firstPlayerTurn, firstPlayer, secondPlayer, gameOver} = this.state;
    if(gameOver){
      return;
    }
    if(!gameStarted){
      if(!placingPiece){
        this.placePiece(id)
      }
    }
    else {
      if(firstPlayerTurn){
        this.attackSquare(id);
      }
    }
  }

  attackSquare = (id) => {
    let {firstPlayerTurn, secondPlayer} = this.state;
    if(firstPlayerTurn){
      let pieces = secondPlayer.pieces;
      if(pieces.canAttackPiece(id)){
        alert(pieces.attackPiece(id, false));
        secondPlayer["pieces"] = pieces;
        this.setState({secondPlayer})
        this.setState({firstPlayerTurn: false})
        setTimeout(this.startAITurn(), 3000)
      }
    }
  }

  startAITurn = () => {
    this.setState({showingBoard1: true})
    this.aiTurn();
  }

  getRandomGuess = () => {
    let {firstPlayer} = this.state;
    let squares = firstPlayer.pieces.squares;
    let id = Math.floor(Math.random() * 100);
    if(squares[id] <= 1){
      return id;
    }
    return this.getRandomGuess();
  }

  aiTurn = () => {
    const {ai,firstPlayer} = this.state;
    let pieces = firstPlayer.pieces;
    let hits = ai.hits;
    let guesses = ai.guesses;
    let hitDirection = ai.hitDirection;
    let nextGuess = 0;
    let guessDirection = "";

    if(hits.length === 0) {
      nextGuess = this.getRandomGuess();
    }
    else if(hits.length === guesses.length) {
      let prevHit = hits[hits.length - 1];
      if(hits.length === 1){
        nextGuess = prevHit + 10;
        if(prevHit < 90 && pieces.canAttackPiece(nextGuess)){
          guessDirection = "Up";
        }
        else {
          nextGuess = prevHit - 10;
          guessDirection = "Down";
        }
      }
      else {
        let prevPrevHit = hits[hits.length - 2];
        let diff = prevHit - prevPrevHit;
        if(diff === 10){
          nextGuess = prevHit + 10;
          if(prevHit < 90 && pieces.canAttackPiece(nextGuess)){
            guessDirection = "Up";
          }
          else{
            nextGuess = hits[0] - 10;
            guessDirection = "Down";
          }
        }
        else if(diff === -10){
          nextGuess = prevHit - 10;
          if(prevHit > 9 && pieces.canAttackPiece(nextGuess)){
            guessDirection = "Down";
          }
          else{
            nextGuess = hits[0] + 10;
            guessDirection = "Up";
          }
        }
        else if(diff === 1){
          let prevRemainder = prevHit % 10;
          nextGuess = prevHit + 1;
          if(prevRemainder != 9 && pieces.canAttackPiece(nextGuess)){
            guessDirection = "Right";
          }
          else {
            nextGuess = hits[0] - 1;
            guessDirection = "Left";
          }
        }
        else if(diff === -1){
          let prevRemainder = prevHit % 10;
          nextGuess = prevHit - 1;
          if(prevRemainder != 0 && pieces.canAttackPiece(nextGuess)){
            guessDirection = "Left";
          }
          else{
            nextGuess = hits[0] + 1;
            guessDirection = "Right";
          }
        }
      }
    }
    else {
      if(hits.length === 1){
        let firstHit = hits[0];
        let firstRem = firstHit % 10;
        let canGuessUp = !hits.includes(firstHit + 10) && firstHit < 90 && pieces.canAttackPiece(firstHit + 10);
        let canGuessDown = !hits.includes(firstHit - 10) && firstHit > 9 && pieces.canAttackPiece(firstHit - 10);
        let canGuessRight = !hits.includes(firstHit + 1) && firstRem < 9 && pieces.canAttackPiece(firstHit + 1);
        let canGuessLeft = !hits.includes(firstHit - 1) && firstRem > 0 && pieces.canAttackPiece(firstHit - 1);
        if(canGuessUp){
          nextGuess = firstHit + 10;
          guessDirection = "Up";
        }
        else if(canGuessDown){
          nextGuess = firstHit - 10;
          guessDirection = "Down";
        }
        else if(canGuessRight){
          nextGuess = firstHit + 1;
          guessDirection = "Right";
        }
        else if(canGuessLeft){
          nextGuess = firstHit - 1;
          guessDirection = "Left";
        }
      }
      else{
        let prevHit = hits[hits.length - 1];
        let prevPrevHit = hits[hits.length - 2];
        let firstHit = hits[0];
        let prevGuess = guesses[guesses.length - 1];
        if(prevHit != prevGuess){
          //switch directions
          let vertical = hits.includes(firstHit + 10);
          let horizontal = hits.includes(firstHit + 1);
          if(vertical){
            nextGuess = firstHit - 10;
            guessDirection = "Down";
          }
          else{
            nextGuess = firstHit - 1;
            guessDirection = "Left";
          }
        }
        else{
          if(hitDirection === "Up"){

          }
          else if(hitDirection === "Down"){
            guessDirection = "Down";
            nextGuess = prevHit - 10;
          }
          else if(hitDirection === "Right"){
            let rem = prevHit % 10;
            if(rem < 9 && pieces.canAttackPiece(prevHit + 1)){
              guessDirection = "Right";
              nextGuess = prevHit + 1;
            }
            else{
              guessDirection = "Left";
              nextGuess = firstHit - 1;
            }
          }
          else if(hitDirection === "Left"){
            guessDirection = "Left";
            nextGuess = prevHit - 1;
          }
        }
      }
    }
    guesses.push(nextGuess);

    if(pieces.canHitPiece(nextGuess)){
      hits.push(nextGuess);
      hitDirection = guessDirection;
    }
    alert(pieces.attackPiece(nextGuess, true));
    firstPlayer["pieces"] = pieces;
    this.setState({firstPlayer})

    ai["hits"] = hits;
    ai["guesses"] = guesses;
    ai["hitDirection"] = hitDirection;
    this.setState({ai});
    setTimeout(this.startUserTurn(), 1000)
  }

  startUserTurn = () => {
    this.setState({showingBoard1: false})
    this.setState({firstPlayerTurn: true})
  }

  resetGame = () => {
    let {firstPlayer, secondPlayer} = this.state;
    firstPlayer["spaces"] = [];
    firstPlayer["won"] = false;
    secondPlayer["spaces"] = [];
    secondPlayer["won"] = false;
    let s = Array(9).fill(null);
    this.setState({squares : s});
    this.setState({firstPlayer});
    this.setState({secondPlayer});
    this.setState({firstPlayerTurn : true});
    this.setState({gameOver : false});
  }

  chooseCharacter = (isFirst, character) =>{
    let {firstPlayer,secondPlayer} = this.state
    if(isFirst){
      firstPlayer["character"] = character;
      this.setState({firstPlayer});
    }
    else{
      secondPlayer["character"] = character;
      this.setState({secondPlayer});
    }
  }

  placePiece = (id) => {
    let {firstPlayer} = this.state;
    let pieces = firstPlayer.pieces;
    let size = pieces.gamePieces[firstPlayer.currentPiece].size;
    let spaces = [];
    for(let i = 0; i < size; i++){
      let dex = id + 10 * i
      if(dex > 99){
        return;
      }
      spaces.push(dex)
    }
    if(pieces.canPlaceGamepiece(spaces)){
      pieces.addPiece(spaces, firstPlayer.currentPiece)
      firstPlayer["pieces"] = pieces;
      this.setState({firstPlayer})
      this.setState({placingPiece: true})
    }
  }

  rotatePiece = () =>{
    let {firstPlayer} = this.state;
    let pieces = firstPlayer.pieces;
    pieces.rotatePiece(firstPlayer.currentPiece);
    firstPlayer["pieces"] = pieces;
    this.setState({firstPlayer});
  }

  confirmPlace = () => {
    let {firstPlayer} = this.state;
    let pieces = firstPlayer.pieces;
    pieces.setOriginalSquares();
    firstPlayer["currentPiece"] = firstPlayer.currentPiece + 1;
    this.setState({firstPlayer});
    this.setState({placingPiece: false});
    if(firstPlayer.currentPiece >= pieces.gamePieces.length){
      this.createAIBoard();
    }
  }

  createAIBoard = () => {
    for(let i = 0; i < 5; i++){
      this.createAIPiece(i);
    }
    this.setState({gameStarted: true})
    this.setState({showingBoard1: false})
  }

  createAIPiece = (dex) => {
    let {secondPlayer} = this.state;
    let pieces = secondPlayer.pieces;
    let size = pieces.gamePieces[dex].size;
    let spaces = [];
    let canPlace = true;
    let id = Math.floor(Math.random() * 100)
    for(let i = 0; i < size; i++){
      let dex = id + 10 * i
      if(dex > 99){
        canPlace = false;
      }
      spaces.push(dex)
    }
    if(!canPlace){
      this.createAIPiece(dex);
    }
    else {
      if(pieces.canPlaceGamepiece(spaces)){
        pieces.addPiece(spaces, dex)
        let numRot = Math.floor(Math.random() * 3)
        for(let i = 0; i < numRot; i++){
          pieces.rotatePiece(dex);
        }
        secondPlayer["pieces"] = pieces;
        this.setState({secondPlayer})
      }
      else{
        this.createAIPiece(dex);
      }
    }
  }

  componentDidMount(){
    audio.play();
    this.setState({musicPlaying:true});
  }

  playMusic = () =>{
    const{musicPlaying} = this.state;
    let isPlaying = musicPlaying;
    isPlaying = !isPlaying;
    if(isPlaying){
      audio.play();
    }
    else{
      audio.pause();
    }
    this.setState({musicPlaying:isPlaying});
  }

  render(){
    let {squares, firstPlayer, secondPlayer, gameOver, musicPlaying, showingBoard1} = this.state;
    let grid = fillArray.map((square,i) =>{
      return(
        <Square key = {i.toString()} id = {i} firstPlayer = {firstPlayer.character} secondPlayer = {secondPlayer.character} firstVal = {firstPlayer.pieces.squares[i]} secondVal = {secondPlayer.pieces.squares[i]} showingBoard1 = {showingBoard1} handleClick = {this.handleClick}  />)
    })
    return (
      <div className = "backgroundStuff">
        <h1 className = "glow">{firstPlayer.won ? firstPlayer.character + " Won" : secondPlayer.won ? secondPlayer.character + " Won" : gameOver ? "It's a Tie" : "BattleThrones"}</h1>
        <Dropdown isFirst = {true} chooseCharacter = {this.chooseCharacter} currentCharacter = {firstPlayer.character}/>
        <Dropdown isFirst = {false} chooseCharacter = {this.chooseCharacter} currentCharacter = {secondPlayer.character}/>
        <button onClick = {this.resetGame} className = "resetButton">Reset</button>
        <button onClick = {this.playMusic} className = "resetButton">{musicPlaying ? "Stop Music": "Play Music"}</button>
        {this.state.placingPiece ? (<button onClick = {this.rotatePiece} className = "resetButton">Rotate</button>): (null)}
        {this.state.placingPiece ? (<button onClick = {this.confirmPlace} className = "resetButton">Confirm</button>): (null)}
        <div className = "grid">
          {grid}
        </div>
        <div className = "characterGrid">
          <img className = "playerOne" src =  {this.getPicture(firstPlayer.character)} alt = {blank}></img>
          <img className = "playerTwo" src =  {this.getPicture(secondPlayer.character)} alt = {blank}></img>
        </div>
        <div className = "nameGrid">
          <h1>{firstPlayer.character}</h1>
          <h1>{secondPlayer.character}</h1>
        </div>
        <div className = "playerGrid">
          <h1>Player One</h1>
          <h1>Player Two</h1>
        </div>
        <div className = "winsGrid">
          <h1>{firstPlayer.wins}</h1>
          <h1>{secondPlayer.wins}</h1>
        </div>
      </div>
    );
  }
}

export default Board;
