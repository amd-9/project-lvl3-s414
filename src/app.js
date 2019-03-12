import { watch } from 'melanke-watchjs';
import validator from 'validator';
import $ from 'jquery';
import xpath from 'xpath';
import RSSFeed from './RSSFeed';

const createCardElement = (cardData) => {
  const { title } = cardData;
  const card = document.createElement('div');
  card.classList.add('card');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('div');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = title;

  card.appendChild(cardBody);
  cardBody.appendChild(cardTitle);

  return card;
};

const renderLinkElement = (linkData) => {
  const { title, link } = linkData;
  const card = document.createElement('div');
  card.classList.add('card');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardLink = document.createElement('a');
  cardLink.classList.add('card-link');
  cardLink.setAttribute('href', link);
  cardLink.textContent = title;
  const cardButton = document.createElement('button');
  cardButton.setAttribute('type', 'button');
  cardButton.setAttribute('data-toggle', 'modal');
  cardButton.setAttribute('data-target', '#itemModal');
  cardButton.textContent = 'Details';
  cardButton.classList.add('btn', 'btn-primary', 'btn-item-details');

  $(cardButton).click(() => {
    $('#item-details-body').text(linkData.description);
  });

  card.appendChild(cardBody);
  cardBody.appendChild(cardLink);
  cardBody.appendChild(cardButton);

  return card;
};

const renderFeeds = (feeds) => {
  const rssFeeds = $('#rssFeeds');
  const rssItems = $('#rssItems');

  rssFeeds.empty();
  rssItems.empty();

  feeds.forEach((feed) => {
    if (feed.is('completed')) {
      rssFeeds.append(createCardElement(feed));
      feed.items.forEach((item) => {
        rssItems.append(renderLinkElement(item));
      });
    }
  });
};


export default () => {
  const state = {
    rssURI: {
      isValid: true,
    },
    rssFeeds: [],
    feedsCount: 0,
  };

  watch(state, 'rssURI', () => {
    $('#txtRSSFeedURI').toggleClass('is-invalid');
  });

  watch(state, 'feedsCount', () => {
    renderFeeds(state.rssFeeds);
  });

  $('#txtRSSFeedURI').on('input', function handler() {
    const val = $(this).val();
    const result = validator.isURL(val);
    state.rssURI.isValid = result;
  });

  $('#btnAddRSSFeed').click(() => {
    if (!state.rssURI.isValid || $('#txtRSSFeedURI').val() === '') {
      state.rssURI.isValid = false;
      return;
    }
    const newFeed = new RSSFeed($('#txtRSSFeedURI').val());

    newFeed.add();

    if (state.rssFeeds.find(feed => feed.uri === newFeed.uri)) {
      newFeed.cancel();
      $('#txtRSSFeedURI').toggleClass('is-invalid');
      return;
    }

    const request = newFeed.request();
    request.then((response) => {
      const parser = new DOMParser();
      const feedDoc = parser.parseFromString(response.data, 'application/xml');
      const title = xpath.select('string(//title)', feedDoc);
      const description = xpath.select('string(//description)', feedDoc);
      newFeed.title = title;
      newFeed.description = description;

      const items = xpath.select('//item', feedDoc);
      newFeed.items = items.map(item => ({
        title: xpath.select('string(./title)', item),
        link: xpath.select('string(./link)', item),
        description: xpath.select('string(./description)', item),
      }));

      newFeed.complete();
      $('#txtRSSFeedURI').val('');
      state.rssFeeds.push(newFeed);
      state.feedsCount = state.rssFeeds.length;
    })
      .catch((error) => {
        console.log(`Error during request to RSS feed URI ${error}`);
        $('#txtRSSFeedURI').toggleClass('is-invalid');
        newFeed.cancel();
      });
  });
};
