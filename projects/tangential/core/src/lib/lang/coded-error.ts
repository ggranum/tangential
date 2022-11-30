export class CodedError extends Error {

  constructor(message: string, public code: any) {
    super(message)
  }
}
