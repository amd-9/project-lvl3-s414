import fs from 'fs';
import path from 'path';
import parseRSS from '../src/rss-parser';

const pathToRSSDataXML = path.resolve(__dirname, '__fixtures__/rss-data.xml');
const rssDataXML = fs.readFileSync(pathToRSSDataXML, 'utf-8');

test('Should parser RSS feed title', () => {
  const expected = 'Lorem ipsum feed for an interval of 1 minutes';
  const parsedRSSData = parseRSS(rssDataXML);

  expect(parsedRSSData.title).toBe(expected);
});


test('Should parser RSS feed description', () => {
  const expected = 'This is a constantly updating lorem ipsum feed';
  const parsedRSSData = parseRSS(rssDataXML);

  expect(parsedRSSData.description).toBe(expected);
});


test('Should parser RSS feed items', () => {
  const expected = 10;
  const parsedRSSData = parseRSS(rssDataXML);

  expect(parsedRSSData.items.length).toBe(expected);
});
