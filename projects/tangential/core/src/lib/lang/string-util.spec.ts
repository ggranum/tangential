/* tslint:disable:no-unused-variable */
import {StringUtil} from './string-util'


describe('core.util.string-util', () => {
  const values = [
    'foo',
    'foo 1',
    'foo 2',
    'bar',
    'bar 2',
    'baz',
  ]


  it('Creates a unique name', () => {
    let x = StringUtil.firstUniqueByCounterSuffix('baz', values)
    expect(x).toBe('baz 1')

    x = StringUtil.firstUniqueByCounterSuffix('bar', values)
    expect(x).toBe('bar 1')

    x = StringUtil.firstUniqueByCounterSuffix('foo', values)
    expect(x).toBe('foo 3')

  })

  it('doesn\'t change an already unique name', () => {
    const x = StringUtil.firstUniqueByCounterSuffix('blarg', values)
    expect(x).toBe('blarg')

  })

});

