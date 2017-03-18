/* tslint:disable:no-unused-variable */
import {generatePushID} from "@tangential/common";
import {StampedMediaType, StampedMediaTypeJson} from "@tangential/media-types";
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
    let key = generatePushID()
    let configKey = generatePushID()
    let perm = new StampedMediaType({}, key)
    expect(perm.$key).toEqual(key)
    expect(perm.createdMils).toBeLessThan(Date.now() + 1)
    expect(perm.editedMils).toBeLessThan(Date.now() + 1)
    done()
  })

  it('Explicit key overrides config key', (done) => {
    let key = generatePushID()
    let explicitKey = generatePushID()
    let config:StampedMediaTypeJson = {
      $key: key
    }
    let perm = new StampedMediaType(config, explicitKey)
    expect(perm.$key).toEqual(explicitKey)
    done()
  })

  it('Key is generated if none provided', (done) => {
    let config:StampedMediaTypeJson = {
    }
    let perm = new StampedMediaType(config)
    expect(perm.$key).toBeTruthy()
    done()
  })


});
