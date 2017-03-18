/* tslint:disable:no-unused-variable */


import {AuthRole, AuthRoleJson} from "@tangential/media-types";
import {generatePushID} from "@tangential/common";
describe('media-types.role', () => {

  it('Loads role from a config object', (done) => {
    let key = generatePushID()
    let config:AuthRoleJson = {
      description: "Test Description",
      orderIndex: 101
    }
    let perm = new AuthRole(config, key)
    expect(perm.$key).toEqual(key)
    expect(perm.createdMils).toBeLessThan(Date.now() + 1)
    expect(perm.editedMils).toBeLessThan(Date.now() + 1)
    expect(perm.description).toBe(config.description)
    expect(perm.orderIndex).toBe(config.orderIndex)
    done()
  })


  it('Exports role instance to Json', (done) => {
    let key = generatePushID()
    let config:AuthRoleJson = {
      createdMils: Date.now() - 100,
      editedMils: Date.now(),
      description: "Test Description",
      orderIndex: 101
    }
    let perm = new AuthRole(config, key)
    let json:AuthRoleJson = perm.toJson(false)

    expect(json.$key).toBeUndefined()
    expect(json.createdMils).toBe(config.createdMils)
    expect(json.editedMils).toBe(config.editedMils)
    expect(json.description).toBe(config.description)
    expect(json.orderIndex).toBe(config.orderIndex)
    done()
  })
});
