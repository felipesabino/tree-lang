import { Tree } from '../src/tree-lang'
import { readFileSync,  } from 'fs'

describe('Strings', () => {

  let inputSource = {
    fetch: () => {},
  }

  it('can strings in a single line', async () => {
    const source = readFileSync(`${__dirname}/fixtures/hello-world.fixture`, 'utf8');
    let scanner = new Tree(source, inputSource);

    let result = scanner.evaluate();

    expect(result.join('')).toMatchObject('Hello World');
  });

})
