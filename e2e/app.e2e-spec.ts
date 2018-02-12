import { AppPage } from './app.po';

describe('filmsfr-web App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display find button', () => {
    page.navigateTo();
    expect(page.getButtonText()).toEqual('Plan a route from most optimal 11 points');
  });
});
