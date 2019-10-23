import React, {Component} from 'react';
import Square from "./Square.js";
import winningConditions from './winningConditions.js';
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

class Board extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      squares: Array(9).fill(null),
      firstPlayer : {
        spaces: [],
        won : false,
        character: characters[0],
        wins: 0
      },
      secondPlayer : {
        spaces: [],
        won : false,
        character: characters[1],
        wins: 0
      },
      musicPlaying: false,
      firstPlayerTurn : true,
      gameOver: false,
      audio : new Audio(theme)
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
    let { firstPlayer, secondPlayer} = this.state;
    let firstWon = false;
    for(let i = 0; i < winningConditions.length; i++){
      for(let j = 0; j < winningConditions[i].length; j++){
        if(firstPlayer.spaces.includes(winningConditions[i][j])){
          firstWon = true;
        }
        else {
          firstWon = false;
          break;
        }
      } 
      if(firstWon){
        break;
      }
    }
    if(firstWon){
      this.setState({gameOver: true});
      firstPlayer["won"] = true;
      let nuWins = firstPlayer.wins + 1;
      firstPlayer["wins"] = nuWins;
      this.setState({firstPlayer});
      return;
    }
    
    let secondWon = false;
    for(let i = 0; i < winningConditions.length; i++){
      for(let j = 0; j < winningConditions[i].length; j++){
        if(secondPlayer.spaces.includes(winningConditions[i][j])){
          secondWon = true;
        }
        else {
          secondWon = false;
          break;
        }
      }
      if(secondWon){
        break;
      }
    }
    
    if(secondWon){
      this.setState({gameOver: true});
      secondPlayer["won"] = true
      let nuWins = secondPlayer.wins + 1;
      secondPlayer["wins"] = nuWins;
      this.setState({secondPlayer});
      return;
    }
    const {squares} = this.state;
    let endGame = true;
    for(let i = 0; i < squares.length; i++){
      if(squares[i] === null){
        endGame = false;
        break;
      }
    }
    if(endGame){
      this.setState({gameOver: true});
    }
  }
  
  handleClick = (id) => {
    let {squares, firstPlayerTurn, firstPlayer, secondPlayer, gameOver} = this.state;
    if(gameOver){
      return;
    }
    let possibleClick = false;
    let s = squares;
    for(let i = 0; i < s.length; i++){
      if(id === i){
        if(s[i] === null){
          possibleClick = true;
          s[i] = firstPlayerTurn ? 1 : 2;
          if(firstPlayerTurn){
            let spa = firstPlayer.spaces;
            spa.push(i);
            firstPlayer["spaces"] = spa
            this.setState({firstPlayer})
          }
          else {
            let spa = secondPlayer.spaces;
            spa.push(i);
            secondPlayer["spaces"] = spa
            this.setState({secondPlayer})
          }
        }
        break;
      }
    }
    if(possibleClick){
      this.setState({squares: s});
      let nuTurn = !firstPlayerTurn;
      this.setState({firstPlayerTurn : nuTurn});
      this.checkIfWinner();
    }
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
  
  componentDidMount(){
    this.state.audio.play();
    this.setState({musicPlaying:true});
  }
  
  playMusic = () =>{
    const{musicPlaying,audio} = this.state;
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
    let {squares, firstPlayer, secondPlayer, gameOver, musicPlaying} = this.state;
    let grid = squares.map((square,i) =>{
      return(
        <Square key = {i.toString()} id = {i} firstPlayer = {firstPlayer.character} secondPlayer = {secondPlayer.character} val = {squares[i]} handleClick = {this.handleClick}  />)
    })
    return (
      <div className = "backgroundStuff">
        <h1 className = "glow">{firstPlayer.won ? firstPlayer.character + " Won" : secondPlayer.won ? secondPlayer.character + " Won" : gameOver ? "It's a Tie" : "Game Of Thrones"}</h1>
        <Dropdown isFirst = {true} chooseCharacter = {this.chooseCharacter} currentCharacter = {firstPlayer.character}/>
        <Dropdown isFirst = {false} chooseCharacter = {this.chooseCharacter} currentCharacter = {secondPlayer.character}/>
        <button onClick = {this.resetGame} className = "resetButton">Reset</button>
        <button onClick = {this.playMusic} className = "resetButton">{musicPlaying ? "Stop": "Play"}</button>
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