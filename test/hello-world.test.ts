import { Tree } from '../src/tree-lang'
import { readFileSync,  } from 'fs'

describe('Hello World', () => {

  let inputSource = {
    fetch: async () => {},
  }

  it('can strings in a single line', async () => {
    const source = readFileSync(`${__dirname}/fixtures/hello-world.fixture`, 'utf8');
    let tree = new Tree();

    let result = await tree.run(source, inputSource.fetch);

    expect(result.map(s => typeof(s) == 'number' ? String.fromCharCode(s) : s ).join('')).toEqual('Hello, World!');
  });

})
