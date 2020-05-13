import { Tree } from '../src/tree-lang'

describe.skip('Numbers', () => {

  let inputSource = {
    fetch: () => { },
  }

  describe('operations', () => {

    it('can sum two numbers', () => {
      const source = `
        ^
        | +
        |/
        | 2
        |/
        | 1
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([3]);
    });

    it('can sum subtract numbers', () => {
      const source = `
        ^
        | -
        |/
      1 |
       \\|
        | 9
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([8]);
    });

    it('can sum multiply numbers', () => {
      const source = `
        ^
        | *
        |/
      5 |
       \\|
        | 9
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([45]);
    });

    it('can sum divide numbers', () => {
      const source = `
        ^
        | %
        |/
      4 |
       \\|
        | 8
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([2]);
    });
  });

  describe('order parsing', () => {

    it('can parse numbers on left branch', () => {
      const source = `
      ^
   98 |
     \\|
      |
      |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([98]);
    });


    it('can parse numbers on left branch with a nested branch', () => {
      const source = `
 54   ^
   23 |
     \\|
      |
      |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([2354]);
    });

    it('can parse numbers on right branch', () => {
      const source = `
      ^
      |
      | 87
      |/
      |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([87]);
    });

    it('can parse numbers on right branch with nested branch', () => {
      const source = `
      ^
      |   54
      | 78
      |/
      |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([7854]);
    });

    it('can parse numbers on all branches', () => {
      const source = `
 34   ^^
   12 |   78
     \\| 56
      |/
      |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([1234, 5678]);
    });
  });
});
