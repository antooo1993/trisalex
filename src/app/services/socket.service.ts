import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

import { Symbol } from '../shared/models/player';

const URL = "10.121.127.80:3000"

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor() { 
    this.socket = socketIo(URL)
  }

  clickedCell(row: number, col: number) {
    this.socket.emit('cell clicked', {row: row, col: col});
  }

  onCellClicked(): Observable<{playerTurn: Symbol, value: {row: number, col: number} }> {
    return new Observable<{playerTurn: Symbol, value: {row: number, col: number} }>(observer => {
      this.socket.on('cell played', (data: {playerTurn: Symbol, value: {row: number, col: number} }) => observer.next(data));
    });
  }

  onPresetGame(): Observable<{playerTurn: Symbol, symbol: Symbol}> {
    return new Observable<{playerTurn: Symbol, symbol: Symbol}>(observer => {
      this.socket.on('login', (data: {playerTurn: Symbol, symbol: Symbol}) => observer.next(data));
    });
  }

  onDisconnect(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.socket.on('disconnect', (data: boolean) => observer.next(data));
    });
  }
}
