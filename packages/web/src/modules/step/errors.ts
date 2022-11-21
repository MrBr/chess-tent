export class IllegalMoveError extends Error {
  moveNumber: number;
  constructor(number: number) {
    super('Illegal move occur in PGN.');
    this.moveNumber = number;
  }
}

export class IllegalGameError extends Error {
  constructor(game: string) {
    super(`Illegal game in PGN: ${game}`);
  }
}

export const isIllegalMoveError = (e: unknown): e is IllegalMoveError =>
  !!e && !!Object.getOwnPropertyDescriptor(e, 'moveNumber');
