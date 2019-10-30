import React, {Component} from 'react';
import Board from './Board'
import './App.css';
import io from 'socket.io-client';

class App extends Component {

  render(){
    return (
      <Board />
    );
  }
}

export default App;
