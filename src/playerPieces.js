class Piece{
  constructor(size){
    this.size = size;
    this.positions = [];
    this.hits = [];
    this.sunk = false;
    this.rotation = 0;
  }

  hasSunkPiece(dex){
    this.hits.push(dex);
    this.sunk = this.hits.length === this.positions.length
    return this.sunk;
  }

  rotatePiece(spaces){
    let rot = this.rotation;
    let finPos = [];
    let anchorPoint = rot === 0 || rot === 270 ? Math.min(...this.positions) : Math.max(...this.positions);
    let anchorRemainder = anchorPoint > 9 ? anchorPoint - anchorPoint % 10 : 0;
    let nuRot = false;

    for(let i = 0; i < 4; i++){
      rot += 90;
      rot = rot < 360 ? rot : 0;
      let canRotate = true;
      finPos = [anchorPoint];
      for(let j = 1; j < this.size; j++){
        if(rot === 0){
          let dex = anchorPoint + 10 * j
          finPos[j] = dex
          if(dex > 99){
            canRotate = false;
            break;
          }
        }
        else if(rot === 90){
          let dex = anchorPoint - j
          let rem = dex > 9 ? dex - dex % 10 : 0;
          finPos[j] = dex
          if(dex < 0 || rem != anchorRemainder){
            canRotate = false;
            break;
          }
        }
        else if(rot === 180){
          let dex = anchorPoint - 10 * j
          finPos[j] = dex
          if(dex < 0){
            canRotate = false;
            break;
          }
        }
        else if(rot === 270){
          let dex = anchorPoint + j
          let rem = dex > 9 ? dex - dex % 10 : 0;
          finPos[j] = dex
          if(dex > 99 || rem != anchorRemainder){
            canRotate = false;
            break;
          }
        }
      }
      if(canRotate){
        nuRot = true;
        for(let k = 0; k < finPos.length; k++){
          if(spaces.includes(finPos[k])){
            nuRot = false;
            break;
          }
        }
        if(nuRot){
          break;
        }
      }
    }
    if(nuRot){
      this.positions = finPos;
      this.rotation = rot;
    }
  }
}

class PlayerPieces{
  constructor(){
    this.gamePieces = [new Piece(2), new Piece(3), new Piece(3), new Piece(4), new Piece(5)];
    this.squares = Array(100).fill(0);
    this.originalSquares = Array(100).fill(0);
  }

  setOriginalSquares(){
    this.originalSquares = this.squares;
  }

  canPlaceGamepiece(arr){
    let canPlace = true;
    for(let i = 0; i < arr.length; i++){
      if(this.squares[arr[i]] === 1){
        canPlace = false;
        break;
      }
    }
    return canPlace;
  }

  addPiece(spaces, dex){
    for(let i = 0; i < spaces.length; i++){
      this.squares[spaces[i]] = 1;
    }
    this.gamePieces[dex].positions = spaces
  }

  canAttackPiece(dex){
    return this.squares[dex]<= 1;
  }

  attackPiece(dex, isUser){
    let hasSunk = false;
    let str = "";
    if(this.squares[dex] === 1){
      for(let i = 0; i < this.gamePieces.length; i++){
        if(this.gamePieces[i].positions.includes(dex)){
          hasSunk = this.gamePieces[i].hasSunkPiece(dex);
          break;
        }
      }
      if(hasSunk){
        str = isUser ? "Your ship has been sunk!" : "You sank their ship!";
      }
      else{
        str = isUser ? "Your ship has been hi!" : "You hit their ship!";
      }
    }else {
      str = isUser ? "Your opponent missed!" : "You missed you fool!";
    }
    this.squares[dex]+=2;
    return str;
  }

  canHitPiece(dex){
    return this.squares[dex]=== 1;
  }

  aiAttackPiece(dex){
    let hit = false;
    let hasSunk = false;
    if(this.squares[dex] === 1){
      hit = true;
      for(let i = 0; i < this.gamePieces.length; i++){
        if(this.gamePieces[i].positions.includes(dex)){
          hasSunk = this.gamePieces[i].hasSunkPiece(dex);
          break;
        }
      }
    }
    this.squares[dex]+=2;
    return hit;
  }

  rotatePiece(dex){
    let initSpaces = this.gamePieces[dex].positions;
    let occupiedSpaces = [];
    for(let i = 0; i < this.gamePieces.length; i++){
      if(i != dex){
        for(let j = 0; j < this.gamePieces[i].positions.length; j++){
          occupiedSpaces.push(this.gamePieces[i].positions[j]);
        }
      }
    }
    this.gamePieces[dex].rotatePiece(occupiedSpaces);
    let nuSpaces = this.gamePieces[dex].positions;
    for(let i = 0; i < initSpaces.length; i++){
      this.squares[initSpaces[i]] = 0;
      this.squares[nuSpaces[i]] = 1;
    }
  }
}

let user = new PlayerPieces()
let opponent = new PlayerPieces()

export default [user,opponent];
