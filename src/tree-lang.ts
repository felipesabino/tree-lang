import { Parser } from './parser';
import { Interpreter } from './interpreter';


export class Tree {

  run(source: string, inputFunction: () => Promise<any>): Promise<any[]> {
    let parser = new Parser(source);
    let parsed = parser.parse();
    let interpreter = new Interpreter(parsed, { fetch: inputFunction});
    return interpreter.interpret();
  }

}
