import { browser, element, by } from 'protractor';

export class TestAppWithNg4Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    let x = element(by.css('.demo-toolbar a'))
    let y =   x.getText();
    debugger
    y.then((r) => {
      console.log('TestAppWithNg4Page', y)
      debugger
    })
    return y
  }
}
