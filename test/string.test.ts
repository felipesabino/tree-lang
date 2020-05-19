import { Tree } from '../src/tree-lang'
import { readFileSync,  } from 'fs'

describe('Hello World', () => {

  let inputSource = {
    fetch: () => {},
  }

  it('can strings in a single line', async () => {
    const source = readFileSync(`${__dirname}/fixtures/hello-world.fixture`, 'utf8');
    let tree = new Tree();

    let result = tree.run(source);

    expect(result.map(s => typeof(s) == 'number' ? String.fromCharCode(s) : s ).join('')).toEqual('Hello, World!');
  });

})
