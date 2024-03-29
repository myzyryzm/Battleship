import React, { Component } from 'react';
import io from 'socket.io-client'
import './App.css';

const serverAddress = 'http://localhost:3000';
class Board2 extends Component {
  constructor(props){
    super(props)
    this.socket = null;
    this.state = {
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
      hoverSquares: Array(100).fill(0),
      showingBoard1: true,
      placingPiece: false,
      musicPlaying: false,
      firstPlayerTurn : true,
      gameOver: false,
      gameStarted: false,
      joined: false
    }
  }

  attackSquare = (id) => {
    let {firstPlayerTurn, secondPlayer, gameOver, playingAI} = this.state;
    if(firstPlayerTurn){
      let pieces = secondPlayer.pieces;
      if(pieces.canAttackPiece(id)){
        let dex = pieces.attackPiece(id);
        alert(this.getAlertText(dex, false));
        secondPlayer["pieces"] = pieces;
        this.setState({secondPlayer})
        this.setState({firstPlayerTurn: false})
        this.checkIfWinner();
        if(!gameOver){
          if(playingAI){
            setTimeout(this.startAITurn(), 3000)
          }
          else{
            this.socket.emit('attack',{
              target: dex,
              sessionKey: window.localStorage.getItem('sessionKey')
            });
          }
        }
      }
    }
  }

  componentDidMount() {
    this.socket = io(serverAddress);
    this.socket.on('attack', data => {
      if(!this.state.firstPlayerTurn && this.state.joined) {
        let{firstPlayer} = this.state;
        let pieces = firstPlayer.pieces
        let dex = pieces.attackPiece(data.target)
        firstPlayer["pieces"] = pieces;
        this.setState({firstPlayer})
        alert(this.getAlertText(dex, true));
        this.checkIfWinner();
        this.setState({firstPlayerTurn: true});
      }
    });
  }
  handleNameInput(e) {
    this.setState({name: e.target.value});
  }
  handleJoin = (e) => {
    fetch(serverAddress + '/create_user', {
      body: JSON.stringify({
        name: ""
      }),
      method: 'post',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => {
      if(json.success) {
        localStorage.sessionKey = json.sessionKey;
        this.setState({joined: true});
      }
    });
  }
  handleDisplayMouseMove(e) {
    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY
    });
    if(this.state.isPenDown) {
      this.display.current.getContext('2d').lineCap = 'round';
      const {top, left} = this.display.current.getBoundingClientRect();
      switch(this.state.toolId) {
        case 'pen':
          this.socket.emit('line',{
            lineWidth: this.state.brushSize,
            lineColor: this.state.brushColor,
            lineCoordinates: [this.state.prevX - left, this.state.prevY - top, this.state.mouseX - left, this.state.mouseY - top],
            sessionKey: window.localStorage.getItem('sessionKey')
          });
          break;
        case 'eraser':
          this.socket.emit('line',{
            lineWidth: this.state.brushSize,
            lineColor: {r: 255, g: 255, b: 255, a: this.state.brushColor.a},
            lineCoordinates: [this.state.prevX, this.state.prevY, this.state.mouseX, this.state.mouseY],
            sessionKey: window.localStorage.getItem('sessionKey')
          });
          break;
      }
    }
    this.setState({
      prevX: this.state.mouseX,
      prevY: this.state.mouseY
    });
    if(!this.state.isPenDown) {
      this.setState({
        prevX: e.clientX,
        prevY: e.clientY
      });
    }
    this.socket.emit('cursor', {
      x: this.state.mouseX,
      y: this.state.mouseY,
      sessionKey: window.localStorage.getItem('sessionKey')
    });
  }
  handleDisplayMouseDown(e) {
    this.setState({isPenDown: true});
  }
  handleDisplayMouseUp(e) {
    this.setState({isPenDown: false});
  }
  handleBrushResize(e) {
    this.setState({brushSize: e.target.value})
  }

  render() {
    return (this.state.loaded?<div>
        <canvas className="display" width="640" height="480" ref={this.display} onMouseMove={this.handleDisplayMouseMove.bind(this)} onMouseDown={this.handleDisplayMouseDown.bind(this)} onMouseUp={this.handleDisplayMouseUp.bind(this)}></canvas>
        <div className="toolbox">
            <ChromePicker color={this.state.brushColor} onChangeComplete={this.handleColorChange.bind(this)}></ChromePicker>
            <Tool name="Eraser" currentTool={this.state.toolId} toolId="eraser" onSelect={this.handleToolClick.bind(this)}/>
            <Tool name="Pen" currentTool={this.state.toolId} toolId="pen" onSelect={this.handleToolClick.bind(this)}/>
            <code className="brush-size-label">Size ({String(this.state.brushSize)})</code> <input onChange={this.handleBrushResize.bind(this)} value={this.state.brushSize} type="range" min="1" max="50"/>
            <span className="brush-size-indicator" style={{width: this.state.brushSize + 'px', height: this.state.brushSize + 'px', background: this.state.brushColor}}></span>
        </div>
        {
          this.state.cursors.map(cursor => (
            <div key={cursor.key} className="cursor" style={{left: (cursor.x+8) + 'px', top: (cursor.y+8) + 'px'}}>
              <div style={{borderRadius: '50px', position: 'relative', background: 'silver', width: '2px', height: '2px'}}></div> {cursor.name}
            </div>
          ))
        }
      </div>:


      <div className="join-container">
        <input type="text" value={this.state.name} onChange={this.handleNameInput.bind(this)} className="join-input" placeholder="Enter a name to use ..."/>
        <br/>
        <button className="join-button" onClick={this.handleJoin.bind(this)}>Join</button>
      </div>);
  }
}

export default Board2;
