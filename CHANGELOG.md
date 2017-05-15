<a name="0.1.1-beta.6"></a>
## [0.1.1-beta.6](https://github.com/ggranum/tangential/compare/v0.1.1-beta.5...v0.1.1-beta.6) (2017-05-15)

Fix packaging issue.


<a name="0.1.1-beta.5"></a>
## [0.1.1-beta.5](https://github.com/ggranum/tangential/compare/v0.1.1-beta.4...v0.1.1-beta.5) (2017-05-15)

Bring the remaining components out of the 'app' and into the @tangential/components library.  

<a name="0.1.1-beta.4"></a>
## [0.1.1-beta.4](https://github.com/ggranum/tangential/compare/v0.1.1-beta.3...v0.1.1-beta.4) (2017-05-13)

### Bug Fixes

* **Build:** Must run ngc to provide metadata for modules.


<a name="0.1.1-beta.3"></a>
## [0.1.1-beta.3](https://github.com/ggranum/tangential/compare/v0.1.1-beta.2...v0.1.1-beta.3) (2017-05-13)

### Bug Fixes

* **authorization-service:** Core not exporting TransformUtil

<a name="0.1.1-beta.2"></a>
## [0.1.1-beta.2](https://github.com/ggranum/tangential/compare/v0.1.1-beta.1...v0.1.1-beta.2) (2017-05-13)


### Features

* **authorization-service:** Move Visitor Service into Auth service ([51c0bcc](https://github.com/ggranum/tangential/commit/51c0bcc))



<a name="0.1.1-beta.1"></a>
## [0.1.1-beta.1](https://github.com/ggranum/tangential/compare/v0.0.1-beta.20...v0.1.1-beta.1) (2017-05-11)


### Features

* **all:** Improvements from development of https://SnapLog.io ([ad262ec](https://github.com/ggranum/tangential/commit/ad262ec))
* **analytics:** Add 'page' super class for managing analytics. ([1019152](https://github.com/ggranum/tangential/commit/1019152))
* **authorization-service:** Record Sign in events ([fe3c2b7](https://github.com/ggranum/tangential/commit/fe3c2b7))
* **firebase:** Improve Auth document layout ([f8a7366](https://github.com/ggranum/tangential/commit/f8a7366))
* **firebase-functions:** Add demo Firebase functions ([bce1a9b](https://github.com/ggranum/tangential/commit/bce1a9b))
* **firebase-functions:** Add watch for setting new user Role ([dfe1858](https://github.com/ggranum/tangential/commit/dfe1858))
* **mobile:** Add favicons and homescreen icons ([fe64723](https://github.com/ggranum/tangential/commit/fe64723))
* **mobile:** Update home screen icon ([8ae4a11](https://github.com/ggranum/tangential/commit/8ae4a11))


### BREAKING CHANGES

* **all:** Basically everything. Please consider this a clean start. We
won't be making such large changes in the future. Promise.
* **all:** The tg- prefix is now tanj-. This should be amenable to
global search and replace.
* **database:** This release reorganizes the structure of the
auth table in firebase. As there is no DB Migration feature yet,
you will need to manually move you auth child documents around
to match. See '/config/common/firebase/databse.init.json' for the
new structure.


<a name="0.0.1-beta.20"></a>
## [0.0.1-beta.20](https://github.com/ggranum/tangential/compare/v0.0.1-beta.19...v0.0.1-beta.20) (2017-04-09)


### Features

* **all:** Update to Angular 4, material 2 beta 3 ([#23](https://github.com/ggranum/tangential/issues/23)) ([690c429](https://github.com/ggranum/tangential/commit/690c429))


### BREAKING CHANGES

* **all:** This commit also removes a dependency on AsciiDoc wrapper project in favor
of (now working) direct npm install asciidoctor.js.

This requires loading asciidoctor.js into the page from your
index.html file, and referencing that file out of node_modules
in your angular-cli.json file.

Warning: As of the AsciiDoctor.js 1.5.5 preview release, adding the
asciidoctor.js file into your page will cause e2e testing to break
with a stack overflow error.



<a name="0.0.1-beta.19"></a>
## [0.0.1-beta.19](https://github.com/ggranum/tangential/compare/v0.0.1-beta.18...v0.0.1-beta.19) (2017-03-30)



<a name="0.0.1-beta.18"></a>
## [0.0.1-beta.18](https://github.com/ggranum/tangential/compare/v0.0.1-beta.17...v0.0.1-beta.18) (2017-03-21)



<a name="0.0.1-beta.17"></a>
## [0.0.1-beta.17](https://github.com/ggranum/tangential/compare/v0.0.1-beta.16...v0.0.1-beta.17) (2017-03-20)



<a name="0.0.1-beta.16"></a>
## [0.0.1-beta.16](https://github.com/ggranum/tangential/compare/v0.0.1-beta.15...v0.0.1-beta.16) (2017-03-20)



<a name="0.0.1-beta.15"></a>
## [0.0.1-beta.15](https://github.com/ggranum/tangential/compare/v0.0.1-beta.14...v0.0.1-beta.15) (2017-03-19)


* Update to Angular 4 RC5


<a name="0.0.1-beta.14"></a>
## [0.0.1-beta.14](https://github.com/ggranum/tangential/compare/v0.0.1-beta.13...v0.0.1-beta.14) (2017-03-18)


* refactor:(authorization-service): remove overcomplication, use firebase directly (#16) ([1e19c93](https://github.com/ggranum/tangential/commit/1e19c93))


### BREAKING CHANGES

* role and permission getters on the User and visitor services are now Promises. Using
Observables was a lie, and overcomplicated the code.



<a name="0.0.1-beta.13"></a>
## [0.0.1-beta.13](https://github.com/ggranum/tangential/compare/v0.0.1-beta.12...v0.0.1-beta.13) (2017-03-17)


### Bug Fixes

* **authorization-service:** republish with missed change ([ded96cc](https://github.com/ggranum/tangential/commit/ded96cc))



<a name="0.0.1-beta.12"></a>
## [0.0.1-beta.12](https://github.com/ggranum/tangential/compare/v0.0.1-beta.11...v0.0.1-beta.12) (2017-03-17)


### Bug Fixes

* **authorization-services:** fix for getRolesForUser$ ([#15](https://github.com/ggranum/tangential/issues/15)) ([8862ac0](https://github.com/ggranum/tangential/commit/8862ac0))



<a name="0.0.1-beta.11"></a>
## [0.0.1-beta.11](https://github.com/ggranum/tangential/compare/v0.0.1-beta.10...v0.0.1-beta.11) (2017-02-23)



<a name="0.0.1-beta.10"></a>
## [0.0.1-beta.10](https://github.com/ggranum/tangential/compare/v0.0.1-beta.9...v0.0.1-beta.10) (2017-02-23)


### Features

* **all:** replace css angular flex with [@angular](https://github.com/angular)/flex-layout ([#13](https://github.com/ggranum/tangential/issues/13)) ([2de0d1f](https://github.com/ggranum/tangential/commit/2de0d1f))



<a name="0.0.1-beta.9"></a>
## [0.0.1-beta.9](https://github.com/ggranum/tangential/compare/v0.0.1-beta.8...v0.0.1-beta.9) (2017-02-21)



<a name="0.0.1-beta.8"></a>
## [0.0.1-beta.8](https://github.com/ggranum/tangential/compare/v0.0.1-beta.7...v0.0.1-beta.8) (2017-02-13)


### Features

* **common:** update material design for fixes ([#10](https://github.com/ggranum/tangential/issues/10)) ([ab8d3d5](https://github.com/ggranum/tangential/commit/ab8d3d5))



<a name="0.0.1-beta.7"></a>
## [0.0.1-beta.7](https://github.com/ggranum/tangential/compare/v0.0.1-beta.6...v0.0.1-beta.7) (2017-02-03)


### Features

* **Auth-Guards:** Add a basic sign-in guard ([3081fd2](https://github.com/ggranum/tangential/commit/3081fd2))



<a name="0.0.1-beta.6"></a>
## [0.0.1-beta.6](https://github.com/ggranum/tangential/compare/v0.0.1-beta.5...v0.0.1-beta.6) (2017-01-25)


### Bug Fixes

* **Asciidoctor-panel:** inconsistent module layout. ([#8](https://github.com/ggranum/tangential/issues/8)) ([d6710ce](https://github.com/ggranum/tangential/commit/d6710ce))



<a name="0.0.1-beta.5"></a>
## [0.0.1-beta.5](https://github.com/ggranum/tangential/compare/v0.0.1-beta.4...v0.0.1-beta.5) (2017-01-25)


### Features

* **SignInPanel:** add Sign In Panel  to demo-app ([#7](https://github.com/ggranum/tangential/issues/7)) ([a7eca2d](https://github.com/ggranum/tangential/commit/a7eca2d))



<a name="0.0.1-beta.4"></a>
## [0.0.1-beta.4](https://github.com/ggranum/tangential/compare/v0.0.1-beta.3...v0.0.1-beta.4) (2017-01-24)


### Bug Fixes

* **firebase-util:** tsconfig path entry must match npm package name ([a77bea6](https://github.com/ggranum/tangential/commit/a77bea6))



<a name="0.0.1-beta.3"></a>
## [0.0.1-beta.3](https://github.com/ggranum/tangential/compare/v0.0.1-beta.2...v0.0.1-beta.3) (2017-01-24)

Beta 2 failed to publish @tangential/data-list. This release is exclusively to fix that issue. 

### Bug Fixes

* **build:** duplicate npm require. ([3b93c3f](https://github.com/ggranum/tangential/commit/3b93c3f))
* **build:** not publishing data-list ([3b94442](https://github.com/ggranum/tangential/commit/3b94442))



<a name="0.0.1-beta.2"></a>
## [0.0.1-beta.2](https://github.com/ggranum/tangential/compare/v0.0.1-beta.1...v0.0.1-beta.2) (2017-01-24)

### Features

* **Admin Console:** stub out managers for users, rules and permissions

* **admin-ui:** update user, role and permission managers

* **UserService:** Update effective permissions on changes to assigned roles, permissions

* **documentation:** describe firebase setup for tangential developers




### Bug Fixes

* **dependencies:** update out of date dependencies ([9c1d586](https://github.com/ggranum/tangential/commit/9c1d586))



<a name="0.0.1-beta.1"></a>
## 0.0.1-beta.1 (2017-01-18)


### Features

* **all:** initial commit, version 0.0.1-beta.0 ([dba108f](https://github.com/ggranum/tangential/commit/dba108f))



