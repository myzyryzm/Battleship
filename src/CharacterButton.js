import React, {Component} from 'react';
import './App.css';

class CharacterButton extends Component {
  render(){
    const {chooseCharacter, character} = this.props
    return (
      <button onClick={() =>chooseCharacter(character)}>{character}</button>
    );
  }
}
export default CharacterButton;