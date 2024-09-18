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

### To use  google-drive neuron uploading in a build
- Navigate to [Google Developer Console](https://console.cloud.google.com/) and [create a new project](https://developers.google.com/workspace/guides/create-project) if you don't already have one
- Enable 'Google Drive API' under 'APIs & Services > Enabled APIs & Services'
- Navigate to 'Credentials'

	#### API Key
	-	Select '+ Create Credentials > API key and save your API key
	
	#### Client ID
	- Select '+ Create Credentials > OAuth client ID' > and click 'configure consent screen' 
	- Enter settings for your application and add the authorized domain for your build. 
	- When complete, save your Client ID

- Replace *<DRIVE_API_KEY>* and *<DRIVE_CLIENT_ID>* with these two keys located in the *dev.env* file under *config/* and run the build.

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
