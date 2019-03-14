export default class RSSReaderModel {
  constructor() {
    this.rssURI = {
      value: null,
      isValid: false,
    };
    this.rssFeeds = [];
    this.message = null;
  }
}
