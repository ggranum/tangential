import * as SemVer from 'semver'


export interface NpmRepository {
  type: string
  url: string
}

export interface NpmBugs {
  url: string
}

/**
 * Type to describe an NPM Package, as read from the file system by
 * jsonFile.readFileSync (jsonFile is an external NPM project)
 */
export interface PackageDescriptor {
  filePath?: string
  name: string
  version: string
  keywords: string[]
  license: string
  homepage: string
  description: string
  main: string
  typings: string
  bugs?: NpmBugs
  repository?: NpmRepository
  dependencies?: {[key: string]: string }
  devDependencies?: {[key: string]: string }
  peerDependencies: {[key: string]: string },
  scripts?:any
}

const subPackageDefinition: PackageDescriptor = {
  name: "@tangential/common",
  version: "0.0.1-beta.5",
  description: "Utility classes and shared functionality for the Tangential components.",
  main: "./index.js",
  typings: "./index.d.ts",
  keywords: [],
  license: "MIT",
  homepage: "https://github.com/ggranum/tangential/src/lib/util/common",
  peerDependencies: {}

}

const rootPackageDefinition: PackageDescriptor = {
  name: "@tangential/common",
  version: "0.0.1-beta.5",
  description: "Utility classes and shared functionality for the Tangential components.",
  main: "./index.js",
  typings: "./index.d.ts",
  repository: {
    type: "git",
    url: "https://github.com/ggranum/tangential.git"
  },
  keywords: [],
  license: "MIT",
  bugs: {
    url: "https://github.com/ggranum/tangential/issues"
  },
  homepage: "https://github.com/ggranum/tangential",
  dependencies: {},
  devDependencies: {},
  peerDependencies: {}
}

function isNumeric(value: any): boolean {
  return !isNaN(value - parseFloat(value));
}

/**
 * Utility class that mostly exists to make updating NPM dependencies on child/dependent modules
 * a bit cleaner.
 */
export class NpmPackageUpdater {

  private fullModuleDefinitions: {[key: string]: PackageDescriptor} = {}
  private readonly globalDependencies: {[key: string]: string};
  /**
   * The root project's version prior to any version bumps. Such as "1.2.3-beta"
   * @private
   */
  private readonly previousGlobalVersion: string

  /**
   * Dependent 'lib' or 'component' projects should all share the same top-level
   * information with their 'parent' package.json definition.
   * This field holds all the information that is common between parent and child projects,
   * such as homepage, version, license, private etc.
   *
   * @private
   */
  private readonly sharedDefinition:PackageDescriptor

  /**
   *
   * @param globalPackageDefinition The root module, generally.
   * @param moduleDefinitions Dependent modules - e.g. libraries.
   * @param bump The bump target, such as 'major', 'minor' etc. @See SemVer#inc
   * @param qualifier The increment qualifier, such as 'beta', 'alpha' or any other string. @See SemVer#inc
   */
  constructor(private globalPackageDefinition: PackageDescriptor,
              private moduleDefinitions: { [key: string]: PackageDescriptor},
              private bump: string,
              private qualifier: string) {
    this.previousGlobalVersion = this.globalPackageDefinition.version

    this.globalDependencies = this.joinMaps(
      this.globalPackageDefinition.dependencies || {},
      this.globalPackageDefinition.devDependencies || {},
      this.globalPackageDefinition.peerDependencies || {}
    )

    this.sharedDefinition = Object.assign( {}, this.globalPackageDefinition, {
      dependencies: {},
      devDependencies: {},
      peerDependencies: {}
    });

    delete this.sharedDefinition.scripts
  }

  /**
   * Bring put the updated version back into the root package definition.
   */
  updatedHostPackage():PackageDescriptor{
    return Object.assign({}, this.globalPackageDefinition, {
      version: this.sharedDefinition.version
    })
  }

  /**
   * Update the 'plugin' package descriptors (those packages that should have peer dependencies on the
   * host ('root') project.
   */
  updatePlugins(): {[key: string]: PackageDescriptor} {
    this.sharedDefinition.version = SemVer.inc(this.sharedDefinition.version, this.bump, this.qualifier)

    Object.keys(this.moduleDefinitions).forEach((key: string) => {
      this.fullModuleDefinitions[key] = this.getFullDefinitionWithBumpedVersion(this.moduleDefinitions[key])
    })

    Object.keys(this.fullModuleDefinitions).forEach((key: string) => {
      let module = this.fullModuleDefinitions[key]
      module.peerDependencies = this.getUpdatedPeerDependencies(module);
    })

    return this.fullModuleDefinitions
  }

  /**
   * Bump the version of the child component package.json and apply all the shared root project
   * definition values that are missing from the child component.
   * @param module
   * @private
   */
  private getFullDefinitionWithBumpedVersion(module: PackageDescriptor): PackageDescriptor {
    let newVersion = SemVer.inc(module.version || this.previousGlobalVersion, this.bump, this.qualifier)
    // Order of the Object assign is very important here - `newVersion` overrides `module.version`,
    // and anything defined in `module` overrides whatever we originally found in the root project definition.
    let fullDefinition = Object.assign({}, this.sharedDefinition, module, {
      version: newVersion
    })
    // @revisit: Does the child component really need to share all the keywords of the root project?
    let keywords = module.keywords.concat(this.sharedDefinition.keywords)
    let map = {} // remove duplicates
    keywords.forEach((item)=>{
      map[item] = true
    })
    keywords = Object.keys(map)
    fullDefinition.keywords = keywords
    return fullDefinition
  }

  /**
   * Plugin projects rely on the dependency versions declared by the host project.
   * For example, Angular should not be declared as a `dependency` or `devDependency`,
   * it should be declared as a `peerDependency`.
   *
   * @param module
   * @private
   */
  private getUpdatedPeerDependencies(module: PackageDescriptor): {[key: string]: string} {
    let peers: {[key: string]: string} = {}
    let x = this.fullModuleDefinitions
    Object.keys(module.peerDependencies).forEach((key: string) => {

      let peerVersion = this.globalDependencies[key]
      if (!peerVersion && x[key]) {
        peerVersion = x[key].version
      }
      if (!peerVersion) {
        if(x[key]){
          console.log('NpmPackageMaker', "Peer version has no value.", x[key].version)
        }
        throw new Error(`Dependency for '${key}' not defined in the global project: cannot determine which version to use for module '${module.name} `)
      }
      // 'truncate and 'x' the version and below the major portion.
      // Peer dependencies should not be exactly tied to the host package version.
      // This is not a thorough test of 'is pre release', but whatevs
      if(peerVersion.indexOf(".") > 0 && SemVer.prerelease(peerVersion) !== null){
        let widerVersion = peerVersion.substring(0, peerVersion.indexOf(".")) + '.x'
        while(!isNumeric(widerVersion.charAt(0))){
          widerVersion = widerVersion.substring(1)
        }
        peers[key] = widerVersion
      }
    })
    return peers;
  }



  /**
   * Gather all the passed dependency maps into one map that we will use later,
   * checking for duplicates along the way, because we can.
   *
   * More thoughtful analysis could lead us to decide not to do this checking and merging...
   * but not merging would mean relying on everyone to use dependencies correctly 100% of the
   * time, which may not be realistic.
   * @param dependencies
   * @param devDependencies
   * @param peerDependencies
   */
  joinMaps(dependencies: {[key: string]: string}, devDependencies: {[key: string]: string}, peerDependencies: {[key: string]: string}): {[key: string]: string} {
    // Could use varArgs version of assign, but then we couldn't error check
    let output: {[key: string]: string} = Object.assign({}, dependencies)
    let errors: string[] = [];


    Object.keys(devDependencies).forEach((key: string) => {
      if (output[key]) {
        errors.push(`Collision while joining maps: '${key}' defined in both 'dependencies' and 'devDependencies'.`)
      }
      output[key] = devDependencies[key]
    })
    /** @todo: ggranum: Should we throw an error if the host project has a peer dependency? I really can't think of a valid use case. */
    Object.keys(peerDependencies).forEach((key: string) => {
      if (output[key]) {
        let abused = devDependencies[key] ? 'devDependencies' : 'dependencies'
        errors.push(`Collision while joining maps: '${key}' defined in both '${abused}' and 'peerDependencies'.`)
      }
      output[key] = devDependencies[key]
    })

    if (errors.length) {
      throw new Error(errors.join("\n"))
    }

    return output
  }
}
