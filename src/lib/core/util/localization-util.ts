export class LocalizationUtil {

  static browserLanguages(): string[] {
    let languages:string[]
    if (navigator['languages']) {
      languages = navigator['languages'] as string[]
    } else {
      languages = [navigator.language]
    }

    return languages
  }

}
