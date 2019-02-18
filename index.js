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
          unicode: process.platform === 'darwin',
          onDone () {
            process.exit(0)
          },
          getOutdated () {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve({
                  '@babel/core': {
                    'current': '7.2.2',
                    'wanted': '7.3.3',
                    'latest': '7.3.3',
                    'location': 'node_modules/@babel/core',
                    'type': 'devDependencies',
                    'homepage': 'https://babeljs.io/'
                  },
                  'ink': {
                    'current': '2.0.0-12',
                    'wanted': '2.0.0-12',
                    'latest': '0.5.1',
                    'location': 'node_modules/ink',
                    'type': 'dependencies',
                    'homepage': 'https://github.com/vadimdemedes/ink#readme'
                  },
                  'ink-spinner': {
                    'current': '2.0.0',
                    'wanted': 'git',
                    'latest': 'git',
                    'location': 'node_modules/ink-spinner',
                    'type': 'dependencies',
                    'homepage': 'https://github.com/vadimdemedes/ink-spinner#readme'
                  },
                  'standard-version': {
                    'current': 'MISSING',
                    'wanted': '5.0.0',
                    'latest': '5.0.0',
                    'location': 'node_modules/standard-version',
                    'type': 'devDependencies',
                    'homepage': 'https://github.com/conventional-changelog/standard-version#readme'
                  },
                  'tap': {
                    'current': '12.5.2',
                    'wanted': '12.5.3',
                    'latest': '12.5.3',
                    'location': 'node_modules/tap',
                    'type': 'devDependencies',
                    'homepage': 'http://node-tap.org/'
                  }
                })
              }, 1500)
            })
          },
          installUpdates (names) {
            return new Promise((resolve, reject) => {
              if (names.length) {
                setTimeout(resolve, 1500)
              } else {
                resolve()
              }
            })
          }
        })
      }
    )
  )
}
