export interface InputSource {
  fetch(): any;
}
export class Tree {

  stack: any[] = [];;
  output: any[] = [];
  visited: { [key: string]: boolean} = {};
  markdToVisit: { [key: string]: string} = {};

  source: string;
  input: InputSource;

  lines: string[] = [];

  currentNumber: any[] = [];

  constructor(source: string, input: InputSource) {
    this.source = source;
    this.input = input;
  }

  evaluate(): any[] {
    console.log(this.source);
    this.lines = this.source.split('\n');
    let found = false;
    for(let i = 0; i < this.lines[this.lines.length - 1].length; i++) {
      if (this.lines[this.lines.length - 1][i] == '|') {
        if (found) {
          this.error('can not have multiple roots', this.lines.length - 1, i);
          break;
        }
        found = true;
        this.move(this.lines.length - 1, i - 1); //   \|  root
        this.move(this.lines.length - 1, i - 1); //    |/ root
        this.spread(this.lines.length - 1, i); //      |  root
      }
    }

    return this.output;
  }

  spread(line: number, column: number) {
    // moves to leafes from left to right
    this.move(line - 1, column - 1); //  \
    this.move(line - 1, column + 1); //  /
    this.move(line - 1, column); //      |
  }

  spreadForNumberRight(line: number, column: number) {

    let char = this.lines[line][column];
    if (!/[0-9]+/.test(char)) {

      let upNeighbor = this.lines[line - 1][column];
      if (/[0-9]+/.test(upNeighbor)) {
        this.spreadForNumberRight(line - 1, column - 1);
      } else {
        return;
      }
    }

    this.currentNumber.push(char);
    this.spreadForNumberRight(line, column + 1);
  }

  spreadForNumberLeft(line: number, column: number) {

    // This is a mess, needs refactoring

    let tempQueue: string[] = [];
    let output: string[] = [];
    let currentLine = line;
    let currentColumn = column;
    while(true) {
      let char = this.lines[currentLine][currentColumn];
      // console.log(`spreadForNumberLeft... [${currentLine};${currentColumn}];'${char}';s${this.stack};n${tempQueue};o${output}`);
      if (/[0-9]+/.test(char)) {
        tempQueue.push(char);
        currentColumn--;
      } else {
        output.push(tempQueue.reverse().join(''));
        tempQueue.length = 0;
        currentLine--;
        let char = this.lines[currentLine][currentColumn];
        if (!/[0-9]+/.test(char)) {
          break;
        }
      }
    }
    this.stack.push(+output.join(''));
  }


  insect(line: number, column: number, compareFunc: (a: any, b: any) => Boolean) {
    let b = this.stack.pop();
    let a = this.stack.pop();
    if (compareFunc(a, b)) {
      if (this.lines[line][column -1] === '\\') {
          /* example:
         move here
          \>|
            |
          */
         this.move(line - 1, column - 2);
      } else if (this.lines[line][column - 2] === '\\') {
        /* example:
       move here
        \!=|
           |
        */
        this.move(line - 1, column - 3);
      } else if (this.lines[line][column + 1] === '/') {
        /* example:
        |  move here
        |>/
        |
        */
       this.move(line - 1, column + 2);
    } else if (this.lines[line][column + 2] === '/') {
        /* example:
            move here
        |!=/
        |
        */
        this.move(line - 1, column + 3);
      }
    }
  }

  binary(op: (a: any, b: any) => any) {
    let b = this.stack.pop();
    let a = this.stack.pop();
    this.stack.push(op(a, b));
  }

  move(line: number, column: number) {

    let node = `[${line};${column}]`;
    if (this.visited[node]) { return; }
    else { this.visited[node] = true; }

    if (line < 0) { return; }
    if (line >= this.lines.length) { return; }
    if (column < 0) { return; }
    if (column >= this.lines[line].length) { return; }

    let charMap: { [index: string] : () => void } = {
      ' ': () => {},
      '': () => {},

      // insects
      '>': () => {
        this.insect(line, column, (a, b) => a > b);
        return;
      },
      '<': () => {
        this.insect(line, column, (a, b) => a < b);
        return;
      },
      '=': () => {
        this.insect(line, column, (a, b) => a == b);
        return;
      },
      '!': () => {
        if (this.lines[line][column + 1] == '=') {
          /*
          |!=/
          |
          */
          this.insect(line, column + 1, (a, b) => a != b);
        } else {
          this.stack.push(char);
        }
        return;
      },

      // leaves
      '+': () => this.binary((a, b) => a + b),
      '-': () => this.binary((a, b) => a - b),
      '*': () => this.binary((a, b) => a * b),
      '%': () => this.binary((a, b) => a / b),
      '@': () => {
        // Pops the top stack element, records its value. Moves the stack element in the position of that value to the top of the stack.
        if (this.stack.length > 0) {
          let index = +this.stack.pop();
          if (index >= 0 && index < this.stack.length) {
            let value = this.stack[index];
            this.stack.splice(index, 1);
            this.stack.push(value);
          }
        }
      },
      '#': () => this.stack.pop(),
      '~': () => {
        if (this.stack.length > 0) {
          let value = this.stack[this.stack.length - 1]
          this.stack.push(value);
        }
      },
      '^': () => {
        if (this.stack.length > 0) {
          this.output.push(this.stack.pop());
        }
      },
      ':': () => {
        this.stack.push(this.input.fetch())
      },

      // branches
      // Ugh, this got messy really quick
      '|': () => this.spread(line, column),
      '\\': () => this.spread(line, column),
      '/': () => this.spread(line, column),
    }

    let char = this.lines[line][column];

    console.log(`moving... [${line};${column}];'${char}';s[${this.stack}];n[${this.currentNumber}];o[${this.output}]`);

    if (charMap[char]) {
      charMap[char]();
    } else if (/[0-9]+/.test(char)) {
      this.number(char, line, column);
    } else {
      this.stack.push(char);
    }
    return;
  }

  number(char: string, line: number, column: number) {
    // moves to leafes from left to right
    /*
    ^ +
 0  |/
  1 |
   \| +
 54 |/
   \| 46
    |/
    |
    this should read 46 and 54 (noticed the reversed reading order)
    then sum both, equal 100
    then read 10 (noticed that 1 and 0 are on nested branches)
    then sum 10 + 100 and pop the result, 110
    */

   let bottomLeft = this.lines[line + 1][column -1];
   let bottomRight = this.lines[line + 1][column + 1];
  //  console.log(`bottomLeft:${bottomLeft};bottomRight:${bottomRight}`);

   if (bottomLeft == "/" || /[0-9]+/.test(bottomLeft)) { // moving right
     this.spreadForNumberRight(line, column);
     this.stack.push(+this.currentNumber.join(''));
     this.currentNumber.length = 0;
   } else if (bottomRight == "\\" || /[0-9]+/.test(bottomRight)) { // moving left
     this.spreadForNumberLeft(line, column);
   } else {
     this.stack.push(+char);
   }
  }

  error(message: string, line: number, column: number) {
    throw new Error(`'${message}' at ${line}:${column}.`);
  }

}
