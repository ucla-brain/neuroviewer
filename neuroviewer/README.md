# neuroviewer

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Reflect on GitHub Pages
``` bash
# Modify config/index.js
assetsPublicPath: '/neuroviewer',

# build for production with minification
npm run build

# Push only the built files under /dist to subtree gh-pages to host on GitHub
git subtree push --prefix neuroviewer/dist origin gh-pages

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
