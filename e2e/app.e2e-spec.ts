import { TestAppWithNg4Page } from './app.po';
import { browser, element, by } from 'protractor';

describe('test-app-with-ng4 App', () => {
  let page: TestAppWithNg4Page;

  beforeEach(() => {
    page = new TestAppWithNg4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo().then(() => {
      console.log('hi')
      let x = element(by.css('.demo-toolbar a'))
      let y =   x.getText();
      y.then((r) => {
        console.log('TestAppWithNg4Page', y)
        debugger

        expect('app works!').toEqual('app works!');
        expect(r).toEqual('app works!');

      })

    });


  });
});
