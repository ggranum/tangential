
export interface ProjectUserAuth {
  uid: string
  email: string
  password: string
  displayName: string
  disabled: boolean
}

export interface FirebaseProjectConfig {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
}
