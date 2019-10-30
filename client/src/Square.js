import React, {Component} from 'react';
import './App.css';
import blank from "./blank.png";
import o from "./o.png";
import x from "./x.png";
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

class Square extends Component {

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

  getSquareState = (val, board1) => {
    const {firstPlayer, secondPlayer} = this.props
    if(val === 0){
      return blank;
    }
    else if(val === 1){
      return board1 ? this.getPicture(firstPlayer) : blank;
    }
    else if(val === 2){
      return o;
    }
    else if(val === 3){
      return board1 ? this.getPicture(firstPlayer) : this.getPicture(secondPlayer);
    }
    //return blank;
  }

  getSquareImage = () => {
    const {placingPiece, gameStarted, firstVal, secondVal, hoverVal, firstPlayer, showingBoard1} = this.props;
    if(!placingPiece && !gameStarted){
      if(firstVal === 1 || hoverVal === 1){
        return this.getPicture(firstPlayer);
      } else {
        return blank;
      }
    }
    else{
      if(showingBoard1){
        return this.getSquareState(firstVal, true);
      }
      else {
        return this.getSquareState(secondVal, false);
      }
    }
  }

  handleClick = () => {
    const {id, handleClick} = this.props
    return handleClick(id);
  }

  hoverOver = () => {
    const {id, placingPiece, gameStarted, hoverOver} = this.props
    if(!placingPiece && !gameStarted){
      return hoverOver(id);
    }
  }

  render(){
    const {id, firstVal, secondVal, showingBoard1, gameStarted} = this.props

    return (
      <div onClick={this.handleClick} onMouseOver = {this.hoverOver} className = "square">
        <img className = "face" src =  {this.getSquareImage()} alt = {blank}></img>
        {gameStarted && ((showingBoard1 && firstVal === 3) || (!showingBoard1 && secondVal === 3)) ? (<img className = "face" src =  {x} alt = {blank}></img>) : (null)}
      </div>
    );
  }
}

export default Square;
