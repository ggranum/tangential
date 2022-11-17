import * as del from 'del';
/**
 * Delete all files in the /dist directory.
 * */
export async function clean(){
  return cleanTask('dist')
}

export async function cleanTask(glob: string) {
  return del(glob)
}

