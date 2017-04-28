/* tslint:disable:no-unused-variable */
import {generatePushID} from '@tangential/core'
import {StampedMediaType, StampedMediaTypeJson} from './stamped-media-type'
describe('media-types.stamped-media-type', () => {

  beforeEach((done) => {
    done()
  })

  afterEach((done) => {
    done()

  })

  afterAll((done) => {
    done()

  })

  it('Loads from a config object', (done) => {
    const key = generatePushID()
    const configKey = generatePushID()
    const perm = new StampedMediaType({}, key)
    expect(perm.$key).toEqual(key)
    expect(perm.createdMils).toBeLessThan(Date.now() + 1)
    expect(perm.editedMils).toBeLessThan(Date.now() + 1)
    done()
  })

  it('Explicit key overrides config key', (done) => {
    const key = generatePushID()
    const explicitKey = generatePushID()
    const config: StampedMediaTypeJson = {
      $key: key
    }
    const perm = new StampedMediaType(config, explicitKey)
    expect(perm.$key).toEqual(explicitKey)
    done()
  })

  it('Key is generated if none provided', (done) => {
    const config: StampedMediaTypeJson = {}
    const perm = new StampedMediaType(config)
    expect(perm.$key).toBeTruthy()
    done()
  })


});
