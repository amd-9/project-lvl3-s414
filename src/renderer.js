import $ from 'jquery';

const renderCardElement = (cardData) => {
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

  cardBody.addEventListener('click', () => {
    const itemDetailsElement = document.querySelector('#item-details-body');
    itemDetailsElement.textContent = linkData.description;
  });

  card.appendChild(cardBody);
  cardBody.appendChild(cardLink);
  cardBody.appendChild(cardButton);

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

  const toastHeader = document.createElement('div');
  toastHeader.classList.add('toast-header');

  const toastHeaderTitle = document.createElement('strong');
  toastHeaderTitle.classList.add('mr-auto');
  toastHeaderTitle.textContent = message.type;

  const toastCloseButton = document.createElement('button');
  toastCloseButton.setAttribute('type', 'button');
  toastCloseButton.classList.add('btn', 'btn-light');
  toastCloseButton.dataset.dismiss = 'toast';
  toastCloseButton.setAttribute('aria-label', 'Close');

  const toastCloseSpan = document.createElement('span');
  toastCloseSpan.setAttribute('aria-hidden', 'true');
  toastCloseSpan.textContent = 'Close';
  toastCloseButton.appendChild(toastCloseSpan);

  toastHeader.appendChild(toastHeaderTitle);
  toastHeader.appendChild(toastCloseButton);

  const toastBody = document.createElement('div');
  toastBody.classList.add('toast-body');
  toastBody.textContent = message.text;


  toast.appendChild(toastHeader);
  toast.appendChild(toastBody);

  document.querySelector('#toastContainer').innerHTML = null;
  document.querySelector('#toastContainer').appendChild(toast);
  $(toast).toast({ delay: 10000 });
  $(toast).toast('show');
};

export default {
  renderFeeds,
  renderToast,
};
