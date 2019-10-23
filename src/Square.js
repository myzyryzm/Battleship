import React, {Component} from 'react';
import './App.css';
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
  render(){
    const {id, handleClick, val, firstPlayer, secondPlayer} = this.props
    return (
      <div onClick={() =>handleClick(id)} className = {val === null ? "square" : "square"}>
        <img className = "face" src =  {val === 1 ? this.getPicture(firstPlayer) : val === 2 ? this.getPicture(secondPlayer) : blank} alt = {blank}></img>
      </div>
    );
  }
}

export default Square;