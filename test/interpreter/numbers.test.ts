import { Interpreter } from '../../src/interpreter';

describe('Numbers', () => {

  let inputSource = {
    fetch: () => { },
  }

  describe('operations', () => {

    it('can sum two numbers', () => {

      let parsed = [1, 2, '+', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([3]);
    });

    it('can subtract numbers', () => {

      let parsed = [9, 1, '-', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([8]);
    });

    it('can multiply numbers', () => {

      let parsed = [9, 5, '*', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([45]);
    });

    it('can divide numbers', () => {

      let parsed = [8, 4, '%', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([2]);
    });

  });

});
