import { Interpreter } from '../../src/interpreter';

describe('Leaves', () => {

  let inputSource = {
    fetch: () => { },
  }

  describe('#', () => {

    it('# pops and discard', () => {

      let parsed = [9, 15, '#', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([9]);
    });

  });

  describe('~', () => {

    it('~ duplicates top element from stack', () => {

      let parsed = [9, 15, '~', '^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([15, 15, 9]);
    });

    it('~ does nothing on an empty stack', () => {

      let parsed = ['~', 15, '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([15]);
    });

  });

  describe(':', () => {

    beforeEach(() => {
      inputSource.fetch = () => {
        return 10;
      }
    });

    it('v gets from innput', () => {

      let parsed = [9, 15, ':', '^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([10, 15, 9]);
    });

  });

  describe('^', () => {

    it('^ does nothing onn an empty stack', () => {

      let parsed = ['^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([]);
    });

  });

  describe('@', () => {

    it('@ replaces top of stack with element', () => {

      let parsed = [9, 8, 0, '@', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([9, 8]);
    });

    it('@ does nothing onn an empty stack', () => {

      let parsed = ['@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([]);
    });

    it('@ does nothing onn an invalid index stack', () => {
      let parsed = [2, '@', '^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([]);
    });

    it('@ can replace itself when stack is empty', () => {
      let parsed = [1, '#', 0, '@', '^', '^', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = interpreter.interpret();

      expect(result).toMatchObject([0]);
    });
  });
})
