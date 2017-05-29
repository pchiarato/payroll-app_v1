import { PortalAppPage } from './app.po';

describe('portal-app App', () => {
  let page: PortalAppPage;

  beforeEach(() => {
    page = new PortalAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
