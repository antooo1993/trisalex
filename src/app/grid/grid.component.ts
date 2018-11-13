import { Component, OnInit } from '@angular/core';

import { Player, Symbol } from '../shared/models/player';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  grid: Symbol[][] = [
    [Symbol.None, Symbol.None, Symbol.None],
    [Symbol.None, Symbol.None, Symbol.None],
    [Symbol.None, Symbol.None, Symbol.None]
  ]
  
  player: Player = new Player();
  gameEnded: boolean = false;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.onCellClicked().subscribe( (response: {playerTurn: Symbol, value: {row: number, col: number}}) => {
      console.log(response);
      this.player.isHisTurn = (response.playerTurn == this.player.symbol)
      this.onGridSelected(response.value.row, response.value.col, response.playerTurn, false);
    });

    this.socketService.onPresetGame().subscribe((response: {playerTurn: Symbol, symbol: Symbol}) => {
      console.log(response);
      
      this.player.symbol = response.symbol;
      this.player.isHisTurn = (response.playerTurn == this.player.symbol)
    });

    this.socketService.onDisconnect().subscribe( (value: boolean) => {
      this.reset();
    });
  }

  onGridSelected(row: number, col: number, symbol: Symbol, isClicked: boolean) {
    if(this.grid[row][col] != Symbol.None || this.gameEnded || !this.player.isHisTurn) return;
    this.grid[row][col] = (isClicked) ? this.player.symbol : this.player.symbol%2 + 1;

    if(isClicked)
      this.socketService.clickedCell(row, col);

    let winner = this.checkWin();
    if(winner!= Symbol.None) {
      this.gameEnded = true;
      alert("HA VINTO IL PLAYER: " + winner);
      this.reset();
    }
  }

  checkWin(): Symbol {
    for(let i = 0; i < this.grid.length; i++) {
      if(this.checkRowAndCol(i))
        return this.player.symbol;
    }
    if(this.checkMainDiagonal() || this.checkSecondaryDiagonal())
      return this.player.symbol;

    return Symbol.None;
  }

  checkRowAndCol(index: number): boolean {
    if(this.grid[index][0] != Symbol.None && this.grid[index][0] == this.grid[index][1] && this.grid[index][0] == this.grid[index][2]) {
      return true;
    }
    else if(this.grid[0][index] != Symbol.None && this.grid[0][index] == this.grid[1][index] && this.grid[0][index] == this.grid[2][index]) {
      return true;
    }
    return false;
  }

  checkMainDiagonal() {
    let cellMainSymbol = this.grid[0][0];
    if(cellMainSymbol == Symbol.None) return false;
    
    for(let i = 0; i < this.grid.length; i++) {
      if (this.grid[i][i] == cellMainSymbol)
        continue;
      else
        return false;
    }
    return true;
  }

  checkSecondaryDiagonal() {
    let cellSeconarySymbol = this.grid[0][this.grid.length-1];
    if(cellSeconarySymbol == Symbol.None) return false;
    
    for(let i = 0; i < this.grid.length; i++) {
      if (this.grid[i][this.grid.length - i - 1] == cellSeconarySymbol)
        continue;
      else
        return false;
    }
    return true;
  }

  reset() {
    this.gameEnded = false;
    for(let i = 0; i < this.grid.length; i++) {
      for(let j = 0; j < this.grid.length; j++) {
        this.grid[i][j] = Symbol.None;
      }
    }
  }
}