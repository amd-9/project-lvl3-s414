import { watch } from 'melanke-watchjs';
import validator from 'validator';
import RSSFeed from './RSSFeed';
import htmlRenderer from './renderer';
import parseRSS from './rss-parser';

export default () => {
  const state = {
    rssURI: {
      value: null,
      isValid: false,
    },
    rssFeeds: [],
    feedsCount: 0,
    message: null,
  };


  const rssFeedUriElement = document.querySelector('#txtRSSFeedURI');
  const addRSSFeedElement = document.querySelector('#btnAddRSSFeed');

  watch(state, 'rssURI', () => {
    if (!state.rssURI.isValid) {
      rssFeedUriElement.classList.add('is-invalid');
      addRSSFeedElement.disabled = true;
    } else {
      rssFeedUriElement.classList.remove('is-invalid');
      addRSSFeedElement.disabled = false;
    }

    if (!state.rssURI.value) {
      rssFeedUriElement.value = '';
    }
  });

  watch(state, 'feedsCount', () => {
    htmlRenderer.renderFeeds(state.rssFeeds);
  });

  watch(state, 'message', () => {
    if (state.message) {
      htmlRenderer.renderToast(state.message);
      state.message = null;
    }
  });

  rssFeedUriElement.addEventListener('input', (e) => {
    state.rssURI.value = e.target.value;
    state.rssURI.isValid = validator.isURL(state.rssURI.value);
  });

  addRSSFeedElement.addEventListener('click', () => {
    if (!state.rssURI.isValid) {
      state.rssURI.isValid = false;
      return;
    }
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
      newFeed.items = rssData.items;
      newFeed.complete();

      state.message = { type: 'Success', text: `RSS Feed at ${state.rssURI.value} added` };
      state.rssURI.value = null;
      state.rssFeeds.push(newFeed);
      state.feedsCount = state.rssFeeds.length;
    })
      .catch((error) => {
        state.message = { type: 'Error', text: error };
        state.rssURI.isValid = false;
        newFeed.cancel();
      });
  });
};
