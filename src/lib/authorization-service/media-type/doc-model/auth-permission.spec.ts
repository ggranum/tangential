import { AuthPermissionDm} from './auth-permission';
/* tslint:disable:no-unused-variable */
import {generatePushID} from '@tangential/core';
import {AuthPermission, AuthPermissionTransform} from '@tangential/authorization-service';

describe('tanj.media-types.permission', () => {

  it('Loads permission from a config object', (done) => {
    const key = generatePushID()
    const config: AuthPermissionDm = {
      description: 'Test Description',
      orderIndex:  101
    }
    const perm = AuthPermission.from(config, key)
    expect(perm.$key).toEqual(key)
    expect(perm.createdMils).toBeLessThan(Date.now() + 1)
    expect(perm.editedMils).toBeLessThan(Date.now() + 1)
    expect(perm.description).toBe(config.description)
    expect(perm.orderIndex).toBe(config.orderIndex)
    done()
  })


  it('Exports permission instance to doc model', (done) => {
    const key = generatePushID()
    const config: AuthPermissionDm = {
      createdMils: Date.now() - 100,
      editedMils:  Date.now(),
      description: 'Test Description',
      orderIndex:  101
    }
    const perm = AuthPermission.from(config, key)
    const json: AuthPermissionDm = AuthPermissionTransform.toDocModel(perm)

    expect(json.$key).toBeUndefined()
    expect(json.createdMils).toBe(config.createdMils)
    expect(json.editedMils).toBe(config.editedMils)
    expect(json.description).toBe(config.description)
    expect(json.orderIndex).toBe(config.orderIndex)
    done()
  })
});
