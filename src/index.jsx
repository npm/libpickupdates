import { Box, Color, StdinContext } from 'ink'
import React, { useEffect, useState } from 'react'
import readline from 'readline'

export default function UpdateInteractiveComponent () {
  useEffect(() => {
    const interval = setInterval(() => {}, 60000)
    return () => clearInterval(interval)
  })
  const [outdated, setOutdated] = useState([
    { name: 'lodash', wanted: '1.2.3', latest: '1.2.3', current: '1.2.0' },
    { name: 'libnpm', current: 'MISSING', wanted: '1.0.0', latest: '1.2.0' }
  ])
  function updateDeps (names) {
    console.error('updating', names.join(', '))
  }
  return (
    <StdinContext.Consumer>
      {({ stdin, setRawMode }) => {
        readline.emitKeypressEvents(stdin)
        setRawMode(true)
        return (
          <UpdatePicker
            outdated={outdated}
            stdin={stdin}
            onSubmit={updateDeps}
          />
        )
      }}
    </StdinContext.Consumer>
  )
}

function UpdatePicker ({ outdated = [], stdin, onSubmit }) {
  return (
    <div>
      <span>Select packages to update:</span>
      <List stdin={stdin} onSubmit={onSubmit}>
        {(outdated || []).map(out => {
          return (
            <ListItem key={out.name} value={out.name}>
              <Color green>{out.name}</Color>
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}

function List ({ children = [], stdin, onSubmit }) {
  const [selected, setSelected] = useState(new Set())
  const [cursor, setCursor] = useState(0)
  useEffect(() => {
    function onKeypress (data, key) {
      if (key.name === 'up') {
        setCursor(cursor === 0
          ? children.length && children.length - 1
          : (cursor + 1) % children.length
        )
      } else if (key.name === 'down') {
        setCursor((cursor + 1) % children.length)
      } else if (data === ' ' && children.length) {
        const val = children[cursor].props.value
        if (selected.has(val)) {
          selected.delete(val)
        } else {
          selected.add(val)
        }
        setSelected(new Set(selected))
      }
    }
    stdin.on('keypress', onKeypress)
    return () => {
      stdin.removeListener('keypress', onKeypress)
    }
  })
  return (
    <Box flexDirection='column'>
      {(children || []).map((child, i) => {
        const cursorIcon = cursor === i ? '>' : ' '
        const checkbox = selected.has(child.props.value) ? '[x]' : '[ ]'
        return (
          <Box key={`${child.props.value}-box`}>
            {cursorIcon} {checkbox} {child}
          </Box>
        )
      })}
    </Box>
  )
}

function ListItem ({ selected, active, children }) {
  return <Box>{children}</Box>
}
