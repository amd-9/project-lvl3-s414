import $ from 'jquery';

const renderCardElement = (cardData) => {
  const { title } = cardData;
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `<div class='card-body'>
                      <div class='card-title'>${title}</div>
                    </div>`;
  return card;
};

const renderLinkElement = (linkData) => {
  const { title, link } = linkData;
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `<div class='card-body'>
    <a href='${link}' class='card-link'>${title}</a>
    <button type='button' 
            data-toggle='modal' 
            data-target='#itemModal' 
            class='btn btn-primary btn-item-details'>
      Details
    </button>
  </div>`;

  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-item-details')) {
      const itemDetailsElement = document.querySelector('#item-details-body');
      itemDetailsElement.innerHTML = linkData.description;
    }
  });

  return card;
};

const renderFeeds = (feeds) => {
  const rssFeeds = document.querySelector('#rssFeeds');
  const rssItems = document.querySelector('#rssItems');

  rssFeeds.innerHTML = null;
  rssItems.innerHTML = null;

  feeds.forEach((feed) => {
    if (feed.is('completed')) {
      rssFeeds.appendChild(renderCardElement(feed));
      feed.items.forEach((item) => {
        rssItems.appendChild(renderLinkElement(item));
      });
    }
  });
};

const renderToast = (message) => {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `<div class='toast-header'>
    <strong class='mr-auto'>${message.type}</strong>
    <button type='button' class='btn btn-light' data-dismiss='toast' aria-label='Close'>
      <span aria-hidden="true">Close</span>
    </button>
  </div>
  <div class='toast-body'>${message.text}</div>`;

  document.querySelector('#toastContainer').innerHTML = null;
  document.querySelector('#toastContainer').appendChild(toast);
  $(toast).toast({ delay: 10000 });
  $(toast).toast('show');
};

export default {
  renderFeeds,
  renderToast,
};
