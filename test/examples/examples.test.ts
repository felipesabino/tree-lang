import { Tree } from '../../src/tree-lang';
import { InputSource } from '../../src/interpreter';
import { readFileSync, } from 'fs';

describe('EXamples', () => {

  let inputSource: InputSource = {
    fetch: async () => { },
  }

  it('Hello, World!', async () => {
    const source = readFileSync(`${__dirname}/fixtures/hello-world.fixture`, 'utf8');
    let tree = new Tree();

    let result = await tree.run(source, inputSource.fetch);

    expect(result.map(s => typeof (s) == 'number' ? String.fromCharCode(s) : s).join('')).toEqual('Hello, World!');
  });

  describe('Input comparison', () => {

    let inputs: number[] = [];

    beforeEach(() => {

      inputSource.fetch = async () => {
        let pop = inputs.pop();
        console.log(`pop: ${pop}`);
        return pop;
      }

    });

    it('Input comparison smaller first', async () => {

      inputs = [5, 100];

      const source = readFileSync(`${__dirname}/fixtures/input-comparison.fixture`, 'utf8');
      let tree = new Tree();

      let result = await tree.run(source, inputSource.fetch);

      expect(result).toEqual([100]);
    });

    it('Input comparison bigger first', async () => {

      inputs = [100, 5];

      const source = readFileSync(`${__dirname}/fixtures/input-comparison.fixture`, 'utf8');
      let tree = new Tree();

      let result = await tree.run(source, inputSource.fetch);

      expect(result).toEqual([100]);
    });

  });

})
