# Auth-Service

An authentication and authorization service built on Firebase and NgStore. Provides roles, permissions and user management, with plans for future asset-level Access Control Lists (ACLs).


## About the data types

### Permissions

Permissions are simple objects, essentially just a key and an optional description. The list of all system permissions are stored in an object map, using the permission "name" as the key. This map is found at the root of the auth-system state object.

A typical system is expected to have no more than a few hundred permissions.

### Roles

A Role is also a simple 'key-description' tuple, and all system roles are stored in a single object map at the root of the auth-system state object.

Because "a role has permissions", there is also a role-permissions map. This map is stored at the root of the auth-system state object, and contains an entry for each role that has any permissions assigned to it. That entry is itself a map, keyed by a permission name. The entry's value is of type 'PermissionGrant'.

Note: Permission Grants are scheduled for refactoring. The entry mentioned above should be shortened to a simple boolean instead of an PermissionGrant data structure.


### Users






### Permissions-oriented

Role based authorization is great, but it isn't actually supported by FireBase Rules in a generalizable way. So our Auth-Service will update a 'flattened' view of a user's permissions table when a permission is granted to or revoked from a role that is already assigned to a user. From a permission and rule management perspective it's fairly transparent, while also allowing FireBase Rules to match one-to-one with  run-time permission checks.


###  Getting Started



