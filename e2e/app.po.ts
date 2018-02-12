import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/home');
  }

  getButtonText() {
    return element(by.css('app-route-planner button')).getText();
  }
}
