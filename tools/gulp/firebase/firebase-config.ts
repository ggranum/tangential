/**
 * The 'gulp firebase:init-project' command will cause this file to be copied to './firebase-config.local.ts'.
 * The init process will prompt you for your project's API key.
 *
 */
export const firebaseConfig = {
  "apiKey": "-your-api-key-",
  "authDomain": "${yourProjectName}.firebaseapp.com",
  "databaseURL": "https://${yourProjectName}.firebaseio.com",
  "storageBucket": "${yourProjectName}.appspot.com"
}
