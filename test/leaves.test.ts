import { Tree } from '../src/tree-lang'

describe('Leaves', () => {

  let inputSource = {
    fetch: () => {},
  }

  describe('#', () => {

    it('# pops and discard', () => {
      const source = `
        ^
        | #
        |/
     15 |
       \\|
        | 9
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([9]);
    });

  });

  describe('~', () => {

    it('~ duplicates top elelmnet from stack', () => {
      const source = `
       ^^^
        | ~
        |/
     15 |
       \\|
        | 9
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([15, 15, 9]);
    });

    it('~ does nothing on an empty stack', () => {
      const source = `
        ^^
        |
        |
     15 |
       \\|
        | ~
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

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
      const source = `
       ^^^
        | :
        |/
     15 |
       \\|
        | 9
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([10, 15, 9]);
    });

  });

  describe('^', () => {

    it('^ does nothing onn an empty stack', () => {
      const source = `
       ^^^
        |
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([]);
    });

  });

  describe('@', () => {

    it('@ replaces top of stack with element', () => {
      const source = `
      ^^
      | @
      |/
    0 |
     \\| 8
      |/
      | 9
      |/
      |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([9, 8]);
    });

    it('@ does nothing onn an empty stack', () => {
      const source = `
       ^^^
        | @
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([]);
    });

    it('@ does nothing onn an invalid index stack', () => {
      const source = `
       ^^^
        | @
      2 |/
       \\|
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([]);
    });

  });
})
