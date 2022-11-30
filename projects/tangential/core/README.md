# Core

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.0.

## Code scaffolding

Run `ng generate component component-name --project core` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project core`.
> Note: Don't forget to add `--project core` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build core` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build core`, go to the dist folder `cd dist/core` and run `npm publish`.

## Running unit tests

Run `ng test core` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


### @todo: Update the following documentation to reflect CORE, as Auth was migrated into its own domain long ago
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




