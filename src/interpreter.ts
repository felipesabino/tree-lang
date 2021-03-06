import { InsectEnclosing } from './parser';

export interface InputSource {
  fetch(): Promise<any>;
}

type CharMap = { [index: string]: () => Promise<void> };

export class Interpreter {

  stack: any[];
  parsed: any[];
  input: InputSource;

  output: any[];

  charMap: CharMap;

  current: number;

  constructor(parsed: any[], input: InputSource) {
    this.parsed = parsed;
    this.input = input;

    this.output = [];
    this.stack = [];

    this.charMap = this.buildCharMap();

    this.current = 0;
  }

  buildCharMap(): CharMap {
    let charMap: CharMap = {
      // insects
      '>': async () =>
        this.insect((a, b) => a > b),
      '<': async() =>
        this.insect((a, b) => a < b),
      '=': async() =>
        this.insect((a, b) => a == b),
      '!=': async() =>
        this.insect((a, b) => a != b),

      // leaves
      '+': async () => this.binary((a, b) => a + b),
      '-': async () => this.binary((a, b) => a - b),
      '*': async () => this.binary((a, b) => a * b),
      '%': async () => this.binary((a, b) => a / b),
      '@': async () => {
        // Pops the top stack element, records its value. Moves the stack element in the position of that value to the top of the stack.
        if (this.stack.length > 0) {
          let index = +this.pop();
          if (index >= 0 && index < this.stack.length) {
            let value = this.stack[index];
            this.stack.splice(index, 1);
            this.push(value);
          } else if (index == 0 && this.stack.length == 0) {
            // 0 indexs replacing itself
            this.push(index);
          }
          // invalid indexes are ignored, should it error?
          // error?
        }
      },
      '#': async () => this.pop(),
      '~': async () => {
        if (this.stack.length > 0) {
          let value = this.stack[this.stack.length - 1]
          this.push(value);
        }
      },
      '^': async () => {
        if (this.stack.length > 0) {
          this.output.push(this.pop());
        }
      },
      ':': async () => {
        let value = await this.input.fetch();
        console.log(`v: ${value}`);
        this.push(value)
      },
    };
    charMap[InsectEnclosing.Open] = async () => {};
    charMap[InsectEnclosing.Close] = async () => {};

    return charMap;
  }

  async interpret(): Promise<any[]> {

    while(!this.isAtEnd()) {
      await this.parse();
    }
    return this.output;
  }

  async parse() {
    let char = this.advance();
    if (this.charMap[char]) {
      await this.charMap[char]();
    } else {
      this.push(char);
    }
  }

  binary(op: (a: any, b: any) => any) {
    let b = this.pop();
    let a = this.pop();
    this.push(op(a, b));
  }

  peek(): any {
    return this.parsed[this.current];
  }

  pop(): any {
    let element = this.stack.pop();
    return element;
  }

  push(element: any) {
    this.stack.push(element);
  }

  peekNext(): any {
    return this.parsed[this.current + 1];
  };

  advance(): any {
    let char = this.parsed[this.current];
    this.current++;
    return char;
  }

  isAtEnd(): boolean {
    return this.current >= this.parsed.length;
  }

  insect(compareFunc: (a: any, b: any) => Boolean) {

    if (this.peek() != InsectEnclosing.Open) {
      // error? should it allow insect chars as output?
      return;
    }

    this.advance(); // consumes InsectEnclosing.Open

    let b = this.pop();
    let a = this.pop();

    if (!compareFunc(a, b)) {
      // skip all leaves and branches nested on this insect
      let enclosingCount = 0;
      while (enclosingCount >= 0 || this.isAtEnd()) { // sugar as nesting insects is currently not supported by parser/syntax
        let char = this.peekNext();
        if (char === InsectEnclosing.Open) {
          enclosingCount++;
        } else if (char === InsectEnclosing.Close) {
          enclosingCount--;
        }
        this.advance(); // consumes insect's nested branches
      }
      this.advance(); // consumes InsectEnclosing.Close
    }
  }
}