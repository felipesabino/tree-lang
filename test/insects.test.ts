import { Tree } from '../src/tree-lang'

describe('Insects', () => {

  let inputSource = {
    fetch: () => {},
  }

  describe('>', () => {

    it('branches if greater is true', () => {
      const source = `
        ^
        |  1
        |>/
      5 |
       \\|
        | 9
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([1]);
    });

    it('does not branch if greater is false', () => {
      const source = `
        ^ 1
        |/ 5
        |>/
      9 |
       \\|
        | 5
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([1]);
    });
  });

  describe('<', () => {

    it('branches if lesser is true', () => {
      const source = `
        ^
        |  1
        |</
     15 |
       \\|
        | 9
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([1]);
    });

    it('does not branch if lesser is false', () => {
      const source = `
      1  ^
       \\|  5
        |</
     19 |
       \\|
        | 15
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([1]);
    });
  });

  describe('=', () => {

    it('branches if equals is true', () => {
      const source = `
        ^
        |  1
        |=/
     15 |
       \\|
        | 15
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([1]);
    });

    it('does not branch if equal is false', () => {
      const source = `
      1  ^
       \\|  5
        |</
     19 |
       \\|
        | 19
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([1]);
    });
  });

  describe('!=', () => {

    it('branches if different is true', () => {
      const source = `
        ^
        |   1
        |!=/
     15 |
       \\|
        | 9
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([1]);
    });

    it('does not branch if different is false', () => {
      const source = `
      1  ^
       \\|   5
        |!=/
     19 |
       \\|
        | 15
        |/
        |`;
      let scanner = new Tree(source, inputSource);

      let result = scanner.evaluate();

      expect(result).toMatchObject([1]);
    });
  });

})
