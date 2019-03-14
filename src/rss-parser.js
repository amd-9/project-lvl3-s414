
export default (rssXMLData) => {
  const parser = new DOMParser();
  const feedDoc = parser.parseFromString(rssXMLData, 'application/xml');
  const rssDataElement = feedDoc.querySelector('rss');

  if (!rssDataElement) {
    throw new Error('No RSS data found in XML');
  }

  const titleElement = rssDataElement.querySelector('title');
  const descriptionElement = rssDataElement.querySelector('description');

  const items = [...rssDataElement.querySelectorAll('item')];

  return {
    title: titleElement.textContent,
    description: descriptionElement.textContent,
    items: items.map(item => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
    })),
  };
};
