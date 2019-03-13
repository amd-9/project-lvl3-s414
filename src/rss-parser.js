const getXMLElementStringValue = (xpathExpression, xmlDoc) => {
  const result = document.evaluate(xpathExpression, xmlDoc, null, XPathResult.STRING_TYPE, null);
  if (result) {
    return result.stringValue;
  }
  return null;
};

export default (rssXMLData) => {
  const rssData = {};
  const parser = new DOMParser();
  const feedDoc = parser.parseFromString(rssXMLData, 'application/xml');
  const title = getXMLElementStringValue('string(//title)', feedDoc);// xpath.select('string(//title)', feedDoc);
  const description = getXMLElementStringValue('string(//description)', feedDoc);
  rssData.title = title;
  rssData.description = description;
  rssData.items = [];

  const items = document.evaluate('//item', feedDoc, null, XPathResult.ANY_TYPE, null);

  let currentItem = items.iterateNext();
  while (currentItem) {
    rssData.items.push({
      title: getXMLElementStringValue('string(./title)', currentItem),
      link: getXMLElementStringValue('string(./link)', currentItem),
      description: getXMLElementStringValue('string(./description)', currentItem),
    });
    currentItem = items.iterateNext();
  }

  return rssData;
};
