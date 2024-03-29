import {ProjectEnvironment} from '../model/project-environment';
import {TangentialError} from './tangential-error';


export class FirebasePrivateKeyNotInitialized extends TangentialError {

  constructor(env: ProjectEnvironment, providedKeyFilePath: string) {
    super(FirebasePrivateKeyNotInitialized.fullMessage(env, providedKeyFilePath));
  }


  static fullMessage(env: ProjectEnvironment, providedKeyPath: string): string {
    let msg = []
    msg.push(`Firebase private key file not found for environment ${env.name}\n`)
    msg.push('    You can download your firebase private key from ')
    msg.push(`https://console.firebase.google.com/project/${env.firebase.config.projectId}/settings/serviceaccounts/adminsdk\n`)
    msg.push(`    Please configure your environment in the project configuration file (${env.project.getConfigFilePath()})`)
    msg.push(`\n    (Provided \`privateKeyPath\` value: ${providedKeyPath})`)
    return msg.join('')
  }

}
