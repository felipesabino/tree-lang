import { Parser, InsectEnclosing } from '../src/parser';

describe('Structure', () => {

  describe('branches', () => {

    it('can parse correctly in a single line', () => {
      const source = ` | `;
      let parser = new Parser(source);

      let result = parser.parse();

      expect(result).toMatchObject([]);
    });

    it('can parse correctly right branches', () => {
      const source = `
      ^
      | 1
      |/
      |`;
      let parser = new Parser(source);

      let result = parser.parse();

      expect(result).toMatchObject([1, '^']);
    });

    it('can parse correctly left branches', () => {
      const source = `
      ^
    2 |
     \\|
      |`;
      let parser = new Parser(source);

      let result = parser.parse();

      expect(result).toMatchObject([2, '^']);
    });

    it('can parse correctly both branches', () => {
      const source = `
      ^^
    2 | 1
     \\|/
      |`;
      let parser = new Parser(source);

      let result = parser.parse();

      expect(result).toMatchObject([2, 1, '^', '^']);
    });

    it('can parse correctly long branches', () => {
      const source = `
      ^^^
       |
 3     | 1   2
  \\    |/   /
   \\   |   /
    \\  |  /
     \\ | /
      \\|/
       |`;
      let parser = new Parser(source);

      let result = parser.parse();

      expect(result).toMatchObject([3, 2, 1, '^', '^', '^']);
    });
  });

  describe('special characters', () => {

    describe('insects', () => {

      it('correctly handles greater than', () => {
        const source = `
        ^
        |  1
        |>/
      5 |
       \\|
        | 9
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([9, 5, '>', InsectEnclosing.Open, 1, InsectEnclosing.Close, '^']);
      });

      it('correctly handles lesser than', () => {
        const source = `
        ^
        |  1
        |</
      15|
       \\|
        | 9
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([9, 15, '<', InsectEnclosing.Open, 1, InsectEnclosing.Close, '^']);
      });

      it('correctly handles equals', () => {
        const source = `
        ^
        |  1
        |=/
      15|
       \\|
        | 15
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([15, 15, '=', InsectEnclosing.Open, 1, InsectEnclosing.Close, '^']);
      });

      it('correctly handles different', () => {
        const source = `
        ^
        |   1
        |!=/
      15|
       \\|
        | 9
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([9, 15, '!=', InsectEnclosing.Open, 1, InsectEnclosing.Close, '^']);
      });

      it('correctly handles different on left branch side', () => {
        const source = `
      1  ^
    5  \\|
     \\!=|
      19|
       \\|
        | 15
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([15, 19, '!=', InsectEnclosing.Open, 5, InsectEnclosing.Close, 1, '^']);
      });

      it('correctly handles nested and multiple insects', () => {
        const source = `
        ^
        |  1
        |>/
        |     2
        |   </
        |  /
        |=/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject(['='
        , InsectEnclosing.Open
        , '<'
        , InsectEnclosing.Open
        , 2
        , InsectEnclosing.Close
        , InsectEnclosing.Close
        , '>'
        , InsectEnclosing.Open
        , 1
        , InsectEnclosing.Close
        , '^']);
      });

    });

    describe('leaves', () => {

      it('correctly handles commands as leaves', () => {
        const source = `
      @ ^
       \\|
      ! |
       \\| #
        |/
        | ~
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject(['~', '#', '!', '@', '^']);
      });

      it('correctly handles number operators as leaves', () => {
        const source = `
      %
       \\| *
        |/
        | -
        |/
        | +
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject(['+', '-', '*', '%']);
      });

    });

  });

  describe('numbers', () => {

    describe('single level', () => {

      it('can parse single digit on right', () => {
        const source = `
        | 1
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([1]);
      });

      it('can parse double digit on right', () => {
        const source = `
        | 12
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([12]);
      });


      it('can parse single digit on left', () => {
        const source = `
      1 |
       \\|
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([1]);
      });

      it('can parse double digit on left', () => {
        const source = `
      12|
       \\|
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([12]);
      });
    });

    describe('double level', () => {

      it('can parse nested single digit on a sigle digit right', () => {
        const source = `
           2
        | 1
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([12]);
      });

      it('can parse nested single digit on a double digit right', () => {
        const source = `
           3
        | 12
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([123]);
      });

      it('can parse nested double digit on a single digit right', () => {
        const source = `
          23
        | 1
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([123]);
      });

      it('can parse nested double digit on a double digit right', () => {
        const source = `
           34
        | 12
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([1234]);
      });

      it('can parse nested single digit on a sigle digit left', () => {
        const source = `
     2
      1 |
       \\|
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([12]);
      });

      it('can parse nested double digit on a sigle digit left', () => {
        const source = `
     23
      1 |
       \\|
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([123]);
      });

      it('can parse nested single digit on a double digit left', () => {
        const source = `
     34
      12|
       \\|
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([1234]);
      });

      it('can parse nested double digit on a single digit left', () => {
        const source = `
     23
      1 |
       \\|
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([123]);
      });

      it('can parse nested grouped numbers', () => {
        const source = `
         2097
        | 54
        | /
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([542097]);
      });

      it('can parse nested a lot of grouped numbers', () => {
        const source = `
         28
          4  12
          2097
        |  54
        |  /
        | /
        |/
        |`;
        let parser = new Parser(source);

        let result = parser.parse();

        expect(result).toMatchObject([54209742812]);
      });
    });
  });

})
