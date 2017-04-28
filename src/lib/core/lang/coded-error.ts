export class CodedError extends Error {

  constructor(public message: string, public code: any) {
    super(message)
  }
}
