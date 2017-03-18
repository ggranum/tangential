/* tslint:disable:no-unused-variable */


import {AuthPermission, AuthPermissionJson} from "@tangential/media-types";
import {generatePushID} from "@tangential/common";
describe('media-types.permission', () => {

  it('Loads permission from a config object', (done) => {
    let key = generatePushID()
    let config:AuthPermissionJson = {
      description: "Test Description",
      orderIndex: 101
    }
    let perm = new AuthPermission(config, key)
    expect(perm.$key).toEqual(key)
    expect(perm.createdMils).toBeLessThan(Date.now() + 1)
    expect(perm.editedMils).toBeLessThan(Date.now() + 1)
    expect(perm.description).toBe(config.description)
    expect(perm.orderIndex).toBe(config.orderIndex)
    done()
  })


  it('Exports permission instance to Json', (done) => {
    let key = generatePushID()
    let config:AuthPermissionJson = {
      createdMils: Date.now() - 100,
      editedMils: Date.now(),
      description: "Test Description",
      orderIndex: 101
    }
    let perm = new AuthPermission(config, key)
    let json:AuthPermissionJson = perm.toJson(false)

    expect(json.$key).toBeUndefined()
    expect(json.createdMils).toBe(config.createdMils)
    expect(json.editedMils).toBe(config.editedMils)
    expect(json.description).toBe(config.description)
    expect(json.orderIndex).toBe(config.orderIndex)
    done()
  })
});
