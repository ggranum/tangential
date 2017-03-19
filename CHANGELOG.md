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



