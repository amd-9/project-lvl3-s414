install:
	npm install

develop:
	npx webpack-dev-server

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

test-coverage:
	npm run test-coverage

watch:
	npm run watch

publish:
	npm publish

lint:
	npx eslint .