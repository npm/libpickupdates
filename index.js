'use strict'

const React = require('react')
const { render, StdinContext } = require('ink')
const readline = require('readline')
const PickUpdatesComponent = require('./dist/index.js').default

module.exports = PickUpdatesComponent
if (module === require.main) {
  render(
    React.createElement(
      StdinContext.Consumer,
      {},
      ({ stdin, setRawMode }) => {
        readline.emitKeypressEvents(stdin)
        setRawMode(true)
        return React.createElement(PickUpdatesComponent, {
          stdin,
          unicode: process.platform === 'darwin'
        })
      }
    )
  )
}
