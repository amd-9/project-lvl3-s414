import { watch } from 'melanke-watchjs';
import validator from 'validator';
import _ from 'lodash';
import RSSFeed from './RSSFeed';
import htmlRenderer from './renderer';
import parseRSS from './rss-parser';

const feedUpdateInterval = 5000;

export default () => {
  const state = {
    blockInput: false,
    rssURI: {
      isPrestine: false,
      value: null,
      isValid: false,
    },
    rssFeeds: [],
    renderToggle: false,
    message: null,
  };

  const rssFeedUriElement = document.querySelector('#txtRSSFeedURI');
  const addRSSFeedElement = document.querySelector('#btnAddRSSFeed');

  const togggleRender = () => {
    state.renderToggle = !state.renderToggle;
  };

  const updateFeed = (feed) => {
    const feedMaxPubDate = _.max(feed.items.map(item => item.pubDate));
    feed.update();
    const request = feed.request();
    request.then((response) => {
      const updatedRSSData = parseRSS(response.data);
      const newItems = updatedRSSData.items.filter(item => item.pubDate > feedMaxPubDate);
      feed.addItems(newItems);
      feed.complete();
      togggleRender();
      setTimeout(() => updateFeed(feed), feedUpdateInterval);
    })
      .catch((error) => {
        state.message = { type: 'Error', text: error };
      });
  };

  watch(state, 'blockInput', () => {
    if (state.blockInput) {
      addRSSFeedElement.disabled = true;
    }
  });

  watch(state, 'rssURI', () => {
    if (state.rssURI.isPrestine) {
      rssFeedUriElement.value = '';
      rssFeedUriElement.classList.remove('is-invalid');
      addRSSFeedElement.disabled = true;
      return;
    }

    if (!state.rssURI.isValid) {
      rssFeedUriElement.classList.add('is-invalid');
      addRSSFeedElement.disabled = true;
    } else {
      rssFeedUriElement.classList.remove('is-invalid');
      addRSSFeedElement.disabled = false;
    }
  });

  watch(state, 'renderToggle', () => {
    htmlRenderer.renderFeeds(state.rssFeeds);
  });

  watch(state, 'message', () => {
    if (state.message) {
      htmlRenderer.renderToast(state.message);
    }
  });

  rssFeedUriElement.addEventListener('input', (e) => {
    if (e.target.value === '') {
      state.rssURI.isPrestine = true;
      return;
    }

    state.rssURI.isPrestine = false;
    state.rssURI.value = e.target.value;
    state.rssURI.isValid = validator.isURL(state.rssURI.value);
  });

  addRSSFeedElement.addEventListener('click', () => {
    if (!state.rssURI.isValid) {
      state.rssURI.isValid = false;
      return;
    }
    state.blockInput = true;
    const newFeed = new RSSFeed(state.rssURI.value);

    newFeed.add();

    if (state.rssFeeds.find(feed => feed.uri === newFeed.uri)) {
      newFeed.cancel();
      state.rssURI.isValid = false;
      state.message = { type: 'Error', text: 'RSS feed already added!' };
      return;
    }

    state.message = { type: 'Info', text: `Requesting RSS Feed at ${state.rssURI.value}` };

    const request = newFeed.request();
    request.then((response) => {
      const rssData = parseRSS(response.data);
      newFeed.title = rssData.title;
      newFeed.description = rssData.description;
      newFeed.addItems(rssData.items);
      newFeed.complete();

      state.message = { type: 'Success', text: `RSS Feed at ${state.rssURI.value} added` };
      state.rssURI.isPrestine = true;
      state.rssFeeds.push(newFeed);
      togggleRender();
      setTimeout(() => updateFeed(newFeed), feedUpdateInterval);
    })
      .catch((error) => {
        state.message = { type: 'Error', text: error };
        state.rssURI.isValid = false;
        newFeed.cancel();
      })
      .finally(() => {
        state.blockInput = false;
      });
  });
};
