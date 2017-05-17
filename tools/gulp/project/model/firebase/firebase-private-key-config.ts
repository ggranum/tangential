
export interface FirebasePrivateKeyConfig {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}

export const FirebasePrivateKeyTemplate:FirebasePrivateKeyConfig = {
  'type': '',
  'project_id': '',
  'private_key_id': '',
  'private_key': '',
  'client_email': '',
  'client_id': '',
  'auth_uri': '',
  'token_uri': '',
  'auth_provider_x509_cert_url': '',
  'client_x509_cert_url': ''
}
