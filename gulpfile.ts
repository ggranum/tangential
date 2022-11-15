export * from './tools/gulp/tasks/clean';
import './tools/gulp/tasks/components';
import './tools/gulp/tasks/e2e';
import './tools/gulp/tasks/lint';
import './tools/gulp/tasks/release';
import './tools/gulp/tasks/link';
import './tools/gulp/tasks/version-bump';
import './tools/gulp/tasks/serve';
import './tools/gulp/project/firebase.gulp';
import './tools/gulp/project/project.gulp';
import {help} from './tools/gulp/tasks/default'


export default help
