import { Interpreter } from '../../src/interpreter';
import { InsectEnclosing } from '../../src/parser';

describe('Insects', () => {

  let inputSource = {
    fetch: async () => { },
  }

  describe('>', () => {

    it('branches if greater is true', async () => {

      let parsed = [2, 1, '>', InsectEnclosing.Open, 'a', InsectEnclosing.Close, 0, '@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject(['a']);
    });

    it('does not branch if greater is false', async () => {

      let parsed = [1, 2, '>', InsectEnclosing.Open, 'a', InsectEnclosing.Close, 0, '@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([0]);
    });
  });

  describe('<', () => {

    it('branches if lesser is true', async () => {

      let parsed = [1, 2, '<', InsectEnclosing.Open, 'a', InsectEnclosing.Close, 0, '@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject(['a']);
    });

    it('does not branch if lesser is false', async () => {

      let parsed = [2, 1, '<', InsectEnclosing.Open, 'a', InsectEnclosing.Close, 0, '@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([0]);
    });
  });

  describe('=', () => {

    it('branches if equals is true', async () => {

      let parsed = [1, 1, '=', InsectEnclosing.Open, 'a', InsectEnclosing.Close, 0, '@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject(['a']);
    });

    it('does not branch if equal is false', async () => {
      let parsed = [2, 1, '=', InsectEnclosing.Open, 'a', InsectEnclosing.Close, 0, '@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([0]);
    });
  });

  describe('!=', () => {

    it('branches if different is true', async () => {
      let parsed = [2, 1, '!=', InsectEnclosing.Open, 'a', InsectEnclosing.Close, 0, '@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject(['a']);
    });

    it('does not branch if different is false', async () => {
      let parsed = [1, 1, '!=', InsectEnclosing.Open, 'a', InsectEnclosing.Close, 0, '@', '^'];

      let interpreter = new Interpreter(parsed, inputSource);
      let result = await interpreter.interpret();

      expect(result).toMatchObject([0]);
    });
  });
})
