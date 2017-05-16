import {ProjectEnvironment} from '../model/project-environment';
import {TangentialError} from './tangential-error';


export class AnalyticsNotInitialized extends TangentialError {

  constructor(env: ProjectEnvironment) {
    super(`Analytics not initialized for environment ${env.name}` + `
    Analytics Tracking Id must be set if analytics are enabled: Current value is '${env.googleAnalytics.trackingId}'. 
    Please configure your environment in the project configuration file (${env.project.getConfigFilePath()})`
      );
  }


}
