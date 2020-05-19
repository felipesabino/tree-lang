export interface InputSource {
  fetch(): any;
}

type StackElements = string | number;

export enum InsectEnclosing {
  Open = '{{{',
  Close = '}}}',
}

export class Parser {

  stack: StackElements[] = [];;
  visited: { [key: string]: boolean } = {};

  source: string;
  lines: string[] = [];

  currentNumber: any[] = [];

  constructor(source: string) {
    this.source = source;
  }

  parse(): any[] {
    this.lines = this.source.split('\n');
    let found = false;
    for (let i = 0; i < this.lines[this.lines.length - 1].length; i++) {
      if (this.lines[this.lines.length - 1][i] == '|') {
        if (found) {
          this.error('can not have multiple roots', this.lines.length - 1, i);
          break;
        }
        found = true;
        let line = this.lines.length - 1;
        this.walk(line, i);
      }
    }

    return this.stack;
  }

  isValidNumber(line: number, column: number) {
    return this.lines[line] &&
      this.lines[line][column] &&
      this.lines[line][column].trim() &&
      +this.lines[line][column] >= 0;
  }

  walkNumber(line: number, column: number, acc: any[] | undefined = undefined) {
    // scanline fill with an offset on the left and right-most indexes when moving to next line

    if (!this.isValidNumber(line, column)) { return; }

    let firstCall = false;
    if (!acc) {
      acc = [];
      firstCall = true;
    }

    let rightColumn = column;
    while (true) {
      let currentNumber = +this.lines[line][rightColumn];

      let node = `[${line};${rightColumn}]`;
      if (!this.isValidNumber(line, rightColumn) ||
        this.visited[node]) { break; }
      this.visited[node] = true;

      acc.push(currentNumber);
      rightColumn++;
    }

    this.walkNumber(line - 1, column - 1, acc); // up left corner
    this.walkNumber(line - 1, column, acc);// up left
    this.walkNumber(line - 1, rightColumn - 1, acc);// up right
    this.walkNumber(line - 1, rightColumn, acc);// up right corner

    if (firstCall) {
      this.stack.push(+acc.join(''));
    }
  }

  peekAndWalk(line: number, column: number): Boolean {

    if (!this.lines[line]) {
      return false;
    }
    let char = this.lines[line][column];

    let node = `[${line};${column}]`;
    if (this.visited[node]) { return true; }
    else { this.visited[node] = true; }

    if (char && /[0-9]/.test(char)) {
      delete this.visited[node]; //hack
      this.walkNumber(line, column);
      return false;
    } else if (char && /[=!<>]/.test(char)) {
      this.walkInsect(line, column);
    } else if (char && char.trim()) { // ?
      this.walk(line, column);
    }

    return true;
  }

  walkInsect(line: number, column: number) {
    if (this.lines[line][column - 1] === '\\') {
      /* example:
     move here
      \>|
        |
      */
      this.pushInsect(line, column, undefined, () => {
        this.walk(line - 1, column - 2);
      });
    } else if (this.lines[line][column - 1] === '!' &&
      this.lines[line][column - 2] === '\\') {
      /* example:
     move here
      \!=|
         |
      */
      this.pushInsect(line, column - 1, column, () => {
        this.walk(line - 1, column - 3);
      });
    } else if (this.lines[line][column + 1] === '/') {
      /* example:
      |  move here
      |>/
      |
      */
      this.pushInsect(line, column, undefined, () => {
        this.walk(line - 1, column + 2);
      });
    } else if (this.lines[line][column + 1] === '=' &&
      this.lines[line][column + 2] === '/') {
      /* example:
          move here
      |!=/
      |
      */
      this.pushInsect(line, column, column + 1, () => {
        this.walk(line - 1, column + 3);
      });
    } else {
      /* regular char leaf
      example:
      | !
      |/
      |
      */
      this.push(line, column);
    }
  }

  walk(line: number, column: number) {

    let char = this.lines[line][column];

    let shouldGoNext: Boolean = true;

    if (char == '|') {
      if (shouldGoNext) { shouldGoNext = this.peekAndWalk(line - 1, column - 1); } //  \
      if (shouldGoNext) { shouldGoNext = this.peekAndWalk(line - 1, column + 1); } //  /
      if (shouldGoNext) { shouldGoNext = this.peekAndWalk(line - 1, column); } //      |
    } else if (char == '\\') {
      // peek up, if / then prioritize
      if (shouldGoNext) { shouldGoNext = this.peekAndWalk(line - 1, column - 1); }
      if (shouldGoNext) { shouldGoNext = this.peekAndWalk(line - 1, column); }
    } else if (char == '/') {
      if (shouldGoNext) { shouldGoNext = this.peekAndWalk(line - 1, column); }
      if (shouldGoNext) { shouldGoNext = this.peekAndWalk(line - 1, column + 1); }
    } else {
      this.push(line, column);
    }
  }

  peek(line: number, column: number) {
    if (this.lines[line] && this.lines[line][column]) {

    }
  }


  error(message: string, line: number, column: number) {
    throw new Error(`'${message}' at ${line}:${column}.`);
  }

  pushInsect(line: number, column1: number,
    column2: number | undefined = undefined,
    walkFunction: () => void) {
    let char: string = '';
    if (this.lines[line]) {
      char += this.lines[line][column1];
    } else {
      return;
    }

    if (typeof (column2) == 'number' && column2 >= 0) {
      char += this.lines[line][column2];
    }

    this.stack.push(char);
    this.stack.push(InsectEnclosing.Open);
    walkFunction();
    this.stack.push(InsectEnclosing.Close);
  }

  push(line: number, column: number) {
    let char: string | number = '';
    if (this.lines[line]) {
      char += this.lines[line][column];
    } else {
      return;
    }
    if (+char >= 0) { // non numbers are NaN, which is not >= 0
      char = +char;
    }
    this.stack.push(char);
  }
}
