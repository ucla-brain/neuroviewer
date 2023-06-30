'use strict'
const { merge } = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_KEY: '"<DRIVE_API_KEY>"',
  CLIENT_ID: '"<DRIVE_CLIENT_ID>"',
  SERVER_PASSWORD: '"<SERVER_PASS>"',
})
