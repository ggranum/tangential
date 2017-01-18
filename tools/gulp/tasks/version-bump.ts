import {task} from 'gulp';
const jsonFile = require('jsonfile');
import gulpRunSequence = require('run-sequence');
import path = require('path');
import minimist = require('minimist');

import {PROJECT_ROOT, SOURCE_ROOT} from '../constants';
import {collectComponents} from "../task_helpers";
import {PackageDescriptor, NpmPackageMaker} from "../package-descriptor";

const argv = minimist(process.argv.slice(3));


const versionBumpPaths = function (paths: string[], bump: any, qualifier: string|string) {
  let modules: {[key: string]: PackageDescriptor} = {}
  paths.forEach((componentPath: string) => {
    let module: PackageDescriptor = readModuleDescriptor(componentPath)
    modules[module.name] = module
  })
  let rootModule = readModuleDescriptor(PROJECT_ROOT)

  let maker:NpmPackageMaker = new NpmPackageMaker(rootModule, modules, bump, qualifier)
  let fullModules = maker.updateModules()

  Object.keys(fullModules).forEach((key:string)=>{
    writeModuleDescriptor(fullModules[key])
  })
  writeModuleDescriptor(maker.updatedRootModule())
};

function readModuleDescriptor(componentPath: string): PackageDescriptor {
  let filePath = path.join(componentPath, 'package.json')
  let module: PackageDescriptor = jsonFile.readFileSync(filePath)
  module.filePath = filePath

  return module
}

function writeModuleDescriptor(module: PackageDescriptor):void {
  let path = module.filePath
  delete module.filePath
  jsonFile.writeFileSync(path, module, {spaces: 2})
}


task(':versionBump', function (done: (err?: any) => void) {
  const bump = argv['bump'];
  const beta = argv['beta'];
  const alpha = argv['alpha'];
  const qualifier = alpha ? 'alpha' : beta ? 'beta' : null

  if (!bump) {
    console.log("You can specify a bump level with --bump=[<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git].");
    console.log("Publishing using 'patch'.");
  } else {
    console.log(`Publishing using the ${bump} tag.`);
  }

  if (!beta && !alpha) {
    console.log("You can increment a pre-release qualifier with '--bump=prerelease --[alpha|beta]'.");
  }
  let paths: string[] = collectComponents(SOURCE_ROOT)
  paths.sort()
  versionBumpPaths(paths, bump, qualifier);
  done()
});

task('versionBump', function (done: () => void) {
  gulpRunSequence(
    ':versionBump',
    done
  );
});
