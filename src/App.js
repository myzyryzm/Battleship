import React, {Component} from 'react';
import Board from './Board'
import './App.css';

class App extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      
    }
  }
  render(){
    return (
      <div>
        <Board />
      </div>
    );
  }
}

export default App;