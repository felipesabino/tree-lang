import { Interpreter } from '../../src/interpreter';

describe('Numbers', () => {

  let inputSource = {
    fetch: async () => { },
  }

  describe('operations', () => {

    it('can sum two numbers', async () => {

      let parsed = [1, 2, '+', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([3]);
    });

    it('can subtract numbers', async () => {

      let parsed = [9, 1, '-', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([8]);
    });

    it('can multiply numbers', async () => {

      let parsed = [9, 5, '*', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([45]);
    });

    it('can divide numbers', async () => {

      let parsed = [8, 4, '%', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([2]);
    });

  });

});
