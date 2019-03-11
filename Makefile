build:
	rm -rf dist
	npm run build

test:
	npm test

test-debug:
	npm run test-debug;

test-coverage:
	npm run test-coverage

watch:
	npm run watch

publish:
	npm publish

lint:
	npx eslint .