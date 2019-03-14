export default class RSSReaderModel {
  constructor() {
    this.rssURI = {
      value: null,
      isValid: false,
      state: 'pristine',
    };
    this.rssFeeds = [];
    this.message = null;
  }
}
