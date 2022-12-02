//noinspection ES6PreferShortImport
import {ObjMapUtil} from '../lang/obj-map-util'
//noinspection ES6PreferShortImport
import {generatePushID} from './generate-push-id'


describe('tanj.util.common.core.generate-push-id', () => {

  it('Generates 20 char long identifiers', () => {
    const key = generatePushID()
    expect(key).toBeDefined()
    expect(key.length).toBe(20, 'Key length should be 20 characters')
  })


  it('Generates many unique identifiers per second', () => {
    const count = 100

    const keyAry = []
    const keyMap = {}
    for (let i = 0; i < count; i++) {
      const key = generatePushID()
      keyAry.push(key)
      keyMap[key] = true
    }
    expect(keyAry.length).toBeDefined()
    expect(ObjMapUtil.toArray(keyMap).length).toBe(count)
  })
})


