export class TangentialError extends Error {

  name: string = TangentialError.name

  constructor(message: string) {
    super(message);
  }


  static handle(e: any) {
    if (e.name == TangentialError.name) {
      console.error('=error=', e.message)
    } else {
      console.error('=error=', 'Unhandled Error:', e)
    }
  }
}
