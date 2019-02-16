'use strict'

const React = require('react')
const { render } = require('ink')
const UpdateInteractiveComponent = require('./dist/index.js').default

module.exports = UpdateInteractiveComponent
if (module === require.main) {
  render(React.createElement(UpdateInteractiveComponent))
}
