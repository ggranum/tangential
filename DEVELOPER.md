= Tangential Developer Docs

## Getting started

This project was bootstrapped from the combination of the Angular Material 2 and an Angular2-cli created project. The build system and file layout in particular are inherited from the [Angular Material2](https://github.com/angular/material2) project. 

To start hacking, perform a clone-install-build:

```bash
> git clone git@github.com:ggranum/tangential.git
> cd tangential
> npm install
> firebase init
# Copy your firebase admin cert to {projectRoot}/firebase.service-account-key.local.json
# See https://console.firebase.google.com/project/${youProjectName}/settings/serviceaccounts/adminsdk
> npm run firebase.init-project
> npm run firebase.init-database
> npm run serve

```



## Project structure

### Build

The build system is really two build systems. Because Webpack isn't great at creating packages (at least when used via Angular-CLI), there is one build path for building out the modularized widget/component packages that are deployed to npm (one per folder under 'lib', at least as the project is currently configured.), and there is another build system for running the demo and the unit tests.
 
Gulp, plus a lot custom build code from the Material Design team, make up the former build system, while Angular CLI handles running the demo and the tests.
  
The main commands for building as a developer will be `npm run serve` and `npm run test` (if you have angular-cli installed globally, you can call `ng serve` and `ng test` directly - see the scripts block in package.json). Both of these tasks will watch for changes. The `serve` task hosts a server at [http://localhost:4200]()

Before submitting a pull request you should verify that you can build using `npm run build`, but other than for that verification step, component developers won't typically need to run the gulp based builds. That's the publisher's main tool.

Publishers will run a couple of tasks - which are explained in more detail later in this file. Obviously running the tests via `npm run test` is a good step in the plan. And even verifying that the demo works via `npm run serve`. Once all that good stuff checks out the Publisher will run the `npm run build` task, followed by the `npm run versionBump` task. Manual inspection of console output and changes made to the submodules' package.json version numbers is next, followed by a commit, generating change logs and some npm publish steps. Again, detailed, step-by-step directions are below. 


## Building

Most builds are just gulp commands aliased in the `package.json` `scripts` section.

See a list of all available gulp build tasks with the `gulp help` command. Take a look in package.json scripts section for the most commonly used build related commands. 

### Dev Builds

```bash

# Just build:
> npm run build

# Build and serve with watch:
> npm run serve
```

`Serve` hosts the demo app at [http://localhost:4200]().

### Release Builds

```bash
> npm run build.release

```


### Running unit tests


```bash
> npm run test
```

### Running end-to-end tests

@todo

## 


## Publishing

These steps have only been tested on OSX. It will probably work on any 'nix variant. Windows 10 with developer 'nix shell is a distinct 'maybe'. 

If you are cloning this project for your own devious purposes, see the **Using this project as a bootstrap** section, near the end.


### Do once (AKA 'setup steps')

1) Create a github access token [https://github.com/settings/tokens]() and save it in a file named `generate-changelog-token.local.txt`
1) Clean and build the project successfully



### Do every release

**Only perform a release from Master branch**

##### Assumptions
1) You have no uncommitted code. 
1) All changes intended for the release have already been merged to master. 

##### Release Process
1) Pull from origin/master
1) Run `gulp versionBump --bump=prerelease --beta`
    * There's also a --alpha flag, and --bump can take any of the semver values that npm version accepts (note, however, this is NOT using 'npm version' to do the update.) 
1) Verify the version number has been updated and that there are no other uncommitted changes. Version numbers should be consistent across modules prior to release. Pending further discussion (and build tooling), this includes even 'new' components that are in an alpha state.
1) Run `git add .` 
1) Run `./generate-changelog.sh patch`
    2) This should only modify and `git add` the changelog file.
    2) Execute the additional steps that are printed out to the console. 
1) Verify change log generated and that there are no uncommitted changes. 
1) Run NPM publish steps, below.

The following require your npm user account credentials. Adding a local `.npmrc` file with `username=foo` and `email=foo@example.com` can make this a bit nicer.

```shell
 # sign out of your normal account
> npm logout
 # Sign in to npm account
> npm login
> Username: (tangential)
> Password:
> Email: (this IS public) (geoff.granum@gmail.com)
> Logged in as tangential on https://registry.npmjs.org/.
> npm run publish 
```


## Using this project as a bootstrap

As mentioned, this project build structure was cloned from the [Angular Material2](https://github.com/angular/material2). The clone was made prior to the Material team updating their build to deliver a single, monolithic NPM project, in line with the Angular2 project structure. 
 
If you wish to release multiple components, but develop in a single project, this project would certainly be a good place to start. You will want to take a look at [the procedures for 'scoped projects'](https://docs.npmjs.com/getting-started/scoped-packages) in NPM, and create a user account that has the name you want to use for the parent project. For example, our project paths here are like '@tangential/scopedProjectNames', where 'tangential' is the npm 'user' name.
   



