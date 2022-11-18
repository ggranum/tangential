'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const rolesPath = 'auth/settings/roles/'
const rolePermissionsPath = 'auth/settings/rolePermissions/'
const authConfigPath = '/auth/settings/configuration/'
const effectivePermissionsPath = 'auth/ep/'
const subjectRolesPath = 'auth/subjectRoles/'

const assignDefaultRoleWatch = functions.auth.user().onCreate(event => {
  console.log('assignDefaultRoleWatch', JSON.stringify(event))
  const user = event.data; // The Firebase user.
  let watchAction = new DefaultRoleWatchAction(user)
  return watchAction.execute(user)
});


class DefaultRoleWatchAction {

  constructor(user) {
    this.user = user
  }

  execute() {
    let p = this.getAuthConfig(this.user)
      .then(() => this.getDefaultRole())
      .then(() => this.getDefaultPermissions())
    return p.then(() => Promise.all([this.assignDefaultRole(), this.assignDefaultPermissions()]))
  }

  getAuthConfig() {
    return admin.database().ref(authConfigPath).once('value').then(snap => this.authConfig = snap.val())
  }

  getDefaultRole() {
    const isAnonymous = this.user.email === null
    const ref = admin.database().ref(rolesPath).child(
      isAnonymous ? this.authConfig.defaultAnonymousRole : this.authConfig.defaultUserRole)
    return ref.once('value')
      .then(snap => {
        this.defaultRole = Object.assign({}, {$key: snap.key}, snap.val())
        // console.log('#getDefaultRole', 'resolved ', ref.toString(), JSON.stringify(this.defaultRole))
      })
  }

  getDefaultPermissions() {
    // console.log( '#getDefaultPermissions')
    const ref = admin.database().ref(rolePermissionsPath).child(this.defaultRole.$key)
    return ref.once('value').then(snap => {
      this.defaultPermissions = snap.val()
      console.log('#getDefaultPermissions', 'resolved ' , ref.toString(), JSON.stringify(this.defaultPermissions))
    })
  }

  assignDefaultRole() {
    // console.log('#assignDefaultRole', JSON.stringify(this.defaultRole))
    let subjectRolesRef = admin.database().ref(subjectRolesPath).child(this.user.uid).child(this.defaultRole.$key)
    return subjectRolesRef.set(true)
  }

  assignDefaultPermissions() {
    // console.log( '#assignDefaultPermissions', JSON.stringify(this.defaultPermissions))
    let subjectEffPermsRef = admin.database().ref(effectivePermissionsPath).child(this.user.uid)
    return subjectEffPermsRef.set(this.defaultPermissions)
  }
}


module.exports = assignDefaultRoleWatch
