import { watch } from 'melanke-watchjs';
import validator from 'validator';
import RSSFeed from './RSSFeed';
import parseRSS from './rss-parser';

export default class RSSReaderController {
  constructor(rssReaderView, rssReaderModel) {
    this.rssReaderView = rssReaderView;
    this.rssReaderModel = rssReaderModel;
  }

  initialize() {
    this.rssReaderView.addRSSFeedClick = () => {
      this.rssReaderModel.message = {
        type: 'Info',
        text: `Requesting RSS feed at ${this.rssReaderModel.rssURI.value}`,
      };

      this.addFeed().then(() => {
        this.rssReaderView.resetInputForm();
      }).catch((error) => {
        this.rssReaderModel.rssURI.isValid = false;
        this.rssReaderModel.message = { type: 'Error', text: error.message };
        this.rssReaderView.validate(this.rssReaderModel);
      });
    };

    this.rssReaderView.rssFeedUriInput = (e) => {
      if (e.target.value === '') {
        this.rssReaderView.resetInputForm();
        return;
      }
      this.rssReaderModel.rssURI.value = e.target.value;
      this.rssReaderModel.rssURI.isValid = validator.isURL(e.target.value);
      this.rssReaderView.validate(this.rssReaderModel);
    };

    this.rssReaderView.initialize();

    watch(this.rssReaderModel, 'message', () => {
      this.rssReaderView.render(this.rssReaderModel);
    });
  }

  addFeed() {
    const addFeedPromise = new Promise((resolve, reject) => {
      const newFeed = new RSSFeed(this.rssReaderModel.rssURI.value);
      newFeed.add();

      if (this.rssReaderModel.rssFeeds.find(feed => feed.uri === newFeed.uri)) {
        newFeed.cancel();
        reject(new Error('RSS feed already added!'));
      }

      const request = newFeed.request();
      request.then((response) => {
        const rssData = parseRSS(response.data);
        newFeed.title = rssData.title;
        newFeed.description = rssData.description;
        newFeed.items = rssData.items;
        newFeed.complete();

        this.rssReaderModel.message = { type: 'Success', text: `RSS Feed at ${this.rssReaderModel.rssURI.value} added` };
        this.rssReaderModel.rssFeeds.push(newFeed);

        resolve();
      })
        .catch((error) => {
          newFeed.cancel();
          reject(new Error(error));
        });
    });

    return addFeedPromise;
  }
}
