'use strict'
const { merge } = require('webpack-merge')
const apiKeys = require('./api-keys.env')


module.exports = merge(apiKeys, {
  NODE_ENV: '"production"'
})
