export enum Symbol {
    None = 0,
    X = 1,
    O = 2
}

export class Player {
    private _name: string;
    private _symbol: Symbol;
    isHisTurn: boolean;

    constructor() { }

    get name(): string {
        return this._name;
    }
    set name(newName: string) {
        this._name = newName;
    }

    get symbol(): Symbol {
        return this._symbol;
    }
    set symbol(newSymbol: Symbol) {
        this._symbol = newSymbol;
    }
}