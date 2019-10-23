import React, { Component } from 'react';
import characters from "./characters.js";
import './App.css';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuShowing: false,
    };
  }
  
  showMenu = (event) => {
    event.preventDefault();
    
    this.setState({ menuShowing: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }
  
  closeMenu = (event) => {
    
    if (!this.dropdownMenu.contains(event.target)) {
      
      this.setState({ menuShowing: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });  
      
    }
  }
  
  forceClose = () => {
    this.setState({ menuShowing: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
  }

  render() {
    const {isFirst, chooseCharacter, currentCharacter} = this.props;
    let playerButtons = characters.map((character,i) =>{
      return(
        <button key = {i.toString()} className = {character === currentCharacter ? "currentCharacterButton" : "characterButton"} 
        onClick={() =>{chooseCharacter(isFirst, character); this.forceClose()}}>{character}</button>)
    })
    return (
      <div>
        <button onClick={this.showMenu} className = "dropdownButton">{isFirst ? "Player One" : "Player Two"}</button>
        {
          this.state.menuShowing
            ? (
              <div
                className="menu"
                ref={(element) => {
                  this.dropdownMenu = element;
                }}
              >
                {playerButtons}
              </div>
            )
            : (
              null
            )
        }
      </div>
    );
  }
}

export default Dropdown