import { Parser } from './parser';
import { Interpreter } from './interpreter';


export class Tree {

  run(source: string): any[] {
    let parser = new Parser(source);
    let parsed = parser.parse();
    let interpreter = new Interpreter(parsed, { fetch: () => {} });
    return interpreter.interpret();
  }

}
