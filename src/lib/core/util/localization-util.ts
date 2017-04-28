export class LocalizationUtil {

  static browserLanguages(): string[] {
    let languages
    if (navigator['languages']) {
      languages = navigator['languages']
    } else {
      languages = [navigator.language]
    }

    return languages
  }

}
