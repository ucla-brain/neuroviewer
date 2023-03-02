'use strict'
const { merge } = require('webpack-merge')

module.exports = merge(apiKeys, {
  NODE_ENV: '"production"',
  API_KEY: '"<DRIVE_API_KEY>"',
  CLIENT_ID: '"<DRIVE_CLIENT-ID>"'
})
