'use strict'
const { merge } = require('webpack-merge')
const prodEnv = require('./prod.env')
const apiKeys = require('./api-keys.env')

module.exports = merge(prodEnv, apiKeys, {
  NODE_ENV: '"development"'
})
