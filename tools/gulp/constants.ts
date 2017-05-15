import {join} from 'path';

//noinspection TypeScriptUnresolvedVariable
export const PROJECT_ROOT = join(__dirname, '../..');
export const SOURCE_ROOT = join(PROJECT_ROOT, 'src');
export const DEFAULT_CONFIG_ROOT = join(PROJECT_ROOT, 'config');
export const DEFAULT_CONFIG_FILE_NAME = 'project.local.json';

export const DIST_ROOT = join(PROJECT_ROOT, 'dist');
export const DIST_COMPONENTS_ROOT = join(DIST_ROOT, '@tangential');
export const PASSWORD_LENGTH = 12
export const JSON_FILE_WRITE_CONFIG = {spaces: 2}


export const NPM_VENDOR_FILES = [
  '@angular',
  'core-js/client',
  'firebase',
  'hammerjs',
  'rxjs',
  'systemjs/dist',
  'zone.js/dist'
];
