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
var currentPiece = 0;

class Board extends Component {

  constructor(props){
    super(props)
    this.state = {
      firstPlayer : {
        pieces: playerPieces[0],
        won : false,
        character: characters[0],
        wins: 0
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
      hoverSquares: Array(100).fill(0),
      showingBoard1: true,
      placingPiece: false,
      musicPlaying: false,
      firstPlayerTurn : true,
      gameOver: false,
      gameStarted: false,
      playingAI: false
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
    let {firstPlayer, secondPlayer} = this.state;
    if(firstPlayer.pieces.hasLost()){
      let secondWins = secondPlayer.wins + 1;
      alert("You lost!")
      secondPlayer["wins"] = secondWins;
      secondPlayer["won"] = true;
      this.setState({secondPlayer});
      this.setState({gameOver: true});
    }
    else if(secondPlayer.pieces.hasLost()){
      let firstWins = firstPlayer.wins + 1;
      alert("You won!")
      firstPlayer["wins"] = firstWins;
      firstPlayer["won"] = true;
      this.setState({firstPlayer});
      this.setState({gameOver: true});
    }
  }

  handleClick = (id) => {
    let {gameStarted, placingPiece, firstPlayerTurn, gameOver, showingBoard1} = this.state;
    if(gameOver){
      return;
    }
    if(!gameStarted){
      if(!placingPiece){
        this.placePiece(id)
      }
    }
    else {
      if(firstPlayerTurn && !showingBoard1){
        this.attackSquare(id);
      }
    }
  }

  attackSquare = (id) => {
    let {firstPlayerTurn, secondPlayer, gameOver, playingAI} = this.state;
    if(firstPlayerTurn){
      let pieces = secondPlayer.pieces;
      if(pieces.canAttackPiece(id)){
        let dex = pieces.attackPiece(id);
        alert(this.getAlertText(dex, false));
        this.checkIfWinner();
        secondPlayer["pieces"] = pieces;
        this.setState({secondPlayer})
        this.setState({firstPlayerTurn: false})
        if(!gameOver){
          if(playingAI){
            setTimeout(this.startAITurn(), 3000)
          }
          else{

          }
        }
      }
    }
  }

  startOpponentTurn = () => {
    this.setState({showingBoard1: true})
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
    if(hits.length === 0){
      guesses = [];
    }
    let dex = pieces.attackPiece(nextGuess)
    alert(this.getAlertText(dex, true));
    this.checkIfWinner();
    if(dex === 2){
      hits = [];
      guesses = [];
      hitDirection = "";
    }

    console.log(hits,guesses,hitDirection);
    firstPlayer["pieces"] = pieces;
    this.setState({firstPlayer})

    ai["hits"] = hits;
    ai["guesses"] = guesses;
    ai["hitDirection"] = hitDirection;
    this.setState({ai});
    setTimeout(this.startUserTurn(), 1000)
  }

  getAlertText = (dex, isOpponenet) => {
    if(dex === 0){
      return isOpponenet ? "Your opponent missed!" : "You missed you fool!";
    }
    if(dex === 1){
      return isOpponenet ? "Your ship has been hit!" : "You hit their ship!";
    }
    if(dex === 2){
      return isOpponenet ? "Your ship has been sunk!" : "You sank their ship!";
    }
  }

  startUserTurn = () => {
    this.setState({showingBoard1: false})
    this.setState({firstPlayerTurn: true})
  }

  resetGame = () => {
    let {firstPlayer, secondPlayer} = this.state;
    let pieces1 = firstPlayer.pieces;
    pieces1.reset();
    firstPlayer["pieces"] = pieces1;
    firstPlayer["won"] = false;
    currentPiece = 0;
    this.setState({firstPlayer});
    let pieces2 = secondPlayer.pieces;
    pieces2.reset();
    secondPlayer["pieces"] = pieces2;
    secondPlayer["won"] = false;
    this.setState({secondPlayer});
    this.setState({gameOver : false, firstPlayerTurn : true, gameStarted : false, showingBoard1: true, placingPiece: false});
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
    let size = pieces.gamePieces[currentPiece].size;
    let spaces = [];
    for(let i = 0; i < size; i++){
      let dex = id + 10 * i
      if(dex > 99){
        return;
      }
      spaces.push(dex)
    }
    if(pieces.canPlaceGamepiece(spaces)){
      pieces.addPiece(spaces, currentPiece)
      firstPlayer["pieces"] = pieces;
      this.setState({hoverSquares: Array(100).fill(0)})
      this.setState({firstPlayer})
      this.setState({placingPiece: true})
    }
  }

  hoverOver = (id) => {
    let {firstPlayer, hoverSquares} = this.state;
    let pieces = firstPlayer.pieces;
    let size = pieces.gamePieces[currentPiece].size;
    let spaces = [];
    for(let i = 0; i < size; i++){
      let dex = id + 10 * i
      if(dex > 99){
        return;
      }
      spaces.push(dex)
    }
    if(pieces.canPlaceGamepiece(spaces)){
      let h = hoverSquares;
      h = Array(100).fill(0);
      for(let i = 0; i < spaces.length; i++){
        h[spaces[i]] = 1;
      }
      this.setState({hoverSquares: h});
    }
  }

  rotatePiece = () =>{
    let {firstPlayer} = this.state;
    let pieces = firstPlayer.pieces;
    pieces.rotatePiece(currentPiece);
    firstPlayer["pieces"] = pieces;
    this.setState({firstPlayer});
  }

  confirmPlace = () => {
    let {firstPlayer} = this.state;
    let pieces = firstPlayer.pieces;
    pieces.setOriginalSquares();
    currentPiece++;
    this.setState({firstPlayer, placingPiece: false});
    if(currentPiece >= pieces.gamePieces.length){
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

  changeBoard = () => {
    let nuShowBoard = !this.state.showingBoard1;
    this.setState({showingBoard1: nuShowBoard});
  }

  render(){
    let {firstPlayer, secondPlayer, gameOver, musicPlaying, showingBoard1, placingPiece, gameStarted, hoverSquares} = this.state;
    console.log(window.innerWidth);
    let grid = fillArray.map((square,i) =>{
      return(
        <Square key = {i.toString()} id = {i} firstPlayer = {firstPlayer.character} secondPlayer = {secondPlayer.character} firstVal = {firstPlayer.pieces.squares[i]} secondVal = {secondPlayer.pieces.squares[i]} hoverVal = {hoverSquares[i]} showingBoard1 = {showingBoard1} gameStarted = {gameStarted} placingPiece = {placingPiece} hoverOver = {this.hoverOver} handleClick = {this.handleClick}  />)
    })
    return (
      <div className = "backgroundStuff">
        <h1 className = "glow">{firstPlayer.won ? firstPlayer.character + " Won" : secondPlayer.won ? secondPlayer.character + " Won" : gameOver ? "It's a Tie" : "BattleThrones"}</h1>
        <Dropdown isFirst = {true} chooseCharacter = {this.chooseCharacter} currentCharacter = {firstPlayer.character} gameStarted = {gameStarted}/>
        <Dropdown isFirst = {false} chooseCharacter = {this.chooseCharacter} currentCharacter = {secondPlayer.character} gameStarted = {gameStarted}/>
        <button onClick = {this.resetGame} className = "resetButton">Reset</button>
        <button onClick = {this.playMusic} className = "resetButton">{musicPlaying ? "Stop Music": "Play Music"}</button>
        {placingPiece ? (<button onClick = {this.rotatePiece} className = "resetButton">Rotate</button>): (null)}
        {placingPiece ? (<button onClick = {this.confirmPlace} className = "resetButton">Confirm</button>): (null)}
        {gameStarted ? (<button onClick = {this.changeBoard} className = "resetButton">{showingBoard1 ? "Show Opponent's Board" : "Show Your Board"}</button>): (null)}
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
