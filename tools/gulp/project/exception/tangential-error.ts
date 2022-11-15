export class TangentialError extends Error {

  name: string = TangentialError.name

  constructor(message: string) {
    super(message);
  }


  static handle(e: any) {
    if (e.name == TangentialError.name) {
      console.error('=error=\n', e.message)
    } else {
      console.error('=error=\n', 'Unhandled Error:', e)
    }
  }
}
