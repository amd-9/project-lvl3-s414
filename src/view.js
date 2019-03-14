import htmlRenderer from './renderer';

export default class RSSReaderView {
  constructor() {
    this.rssReaderModel = null;

    this.addRSSFeedClick = null;
    this.rssFeedUriInput = null;

    this.rssFeedUriElement = null;
    this.addRSSFeedElement = null;
  }

  initialize() {
    this.rssFeedUriElement = document.querySelector('#txtRSSFeedURI');
    this.addRSSFeedElement = document.querySelector('#btnAddRSSFeed');

    this.rssFeedUriElement.addEventListener('input', this.rssFeedUriInput);
    this.addRSSFeedElement.addEventListener('click', (e) => {
      this.addRSSFeedElement.disabled = true;
      this.addRSSFeedClick(e);
    });
  }

  render(viewModel) {
    this.rssReaderModel = viewModel;
    htmlRenderer.renderFeeds(viewModel.rssFeeds);
    if (viewModel.message) {
      htmlRenderer.renderToast(viewModel.message);
    }
  }

  validate(viewModel) {
    if (viewModel.rssURI.isValid) {
      this.rssFeedUriElement.classList.remove('is-invalid');
      this.addRSSFeedElement.disabled = false;
    } else {
      this.rssFeedUriElement.classList.add('is-invalid');
      this.addRSSFeedElement.disabled = true;
    }
  }

  resetInputForm() {
    this.rssFeedUriElement.value = '';
    this.rssFeedUriElement.classList.remove('is-invalid');
    this.addRSSFeedElement.disabled = true;
  }
}
