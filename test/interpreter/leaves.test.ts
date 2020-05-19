import { Interpreter, InputSource } from '../../src/interpreter';

describe('Leaves', () => {

  let inputSource: InputSource = {
    fetch: async () => { },
  }

  describe('#', () => {

    it('# pops and discard', async () => {

      let parsed = [9, 15, '#', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([9]);
    });

  });

  describe('~', () => {

    it('~ duplicates top element from stack', async () => {

      let parsed = [9, 15, '~', '^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([15, 15, 9]);
    });

    it('~ does nothing on an empty stack', async () => {

      let parsed = ['~', 15, '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([15]);
    });

  });

  describe(':', () => {

    beforeEach(() => {
      inputSource.fetch = async () => 10;
    });

    it('v gets from innput', async () => {

      let parsed = [9, 15, ':', '^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([10, 15, 9]);
    });

  });

  describe('^', () => {

    it('^ does nothing onn an empty stack', async () => {

      let parsed = ['^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([]);
    });

  });

  describe('@', () => {

    it('@ replaces top of stack with element', async () => {

      let parsed = [9, 8, 0, '@', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([9, 8]);
    });

    it('@ does nothing onn an empty stack', async () => {

      let parsed = ['@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([]);
    });

    it('@ does nothing onn an invalid index stack', async () => {
      let parsed = [2, '@', '^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([]);
    });

    it('@ can replace itself when stack is empty', async () => {
      let parsed = [1, '#', 0, '@', '^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([0]);
    });
  });
})
