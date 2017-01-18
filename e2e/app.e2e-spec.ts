import { TangentialDemoPage } from './app.po';

describe('tangential-demo App', function() {
  let page: TangentialDemoPage;

  beforeEach(() => {
    page = new TangentialDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
