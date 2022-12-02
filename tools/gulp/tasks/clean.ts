import * as del from 'del';
/**
 * Delete all files in the /dist directory.
 * */
export async function clean(){
  return deleteGlob('dist')
}

/**
 * Keep use of 'del' in one location, for future accident-proofing.
 * @param glob A dangerous weapon if you're using relative directories. See documentation for del at https://www.npmjs.com/package/del
 */
export async function deleteGlob(glob: string) {
  return del(glob)
}

