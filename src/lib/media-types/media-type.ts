export interface TypeDescriptor {
  prefix: string,
  name: string,
  version: number
}

export interface MediaType {
  descriptor:TypeDescriptor
  definition: any
}
