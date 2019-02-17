import { Box, Color, Text } from 'ink'
import React, { useEffect, useState } from 'react'

export default function UpdateInteractiveComponent ({ stdin, unicode }) {
  const [outdated, setOutdated] = useState([
    { name: 'lodash', wanted: '1.2.3', latest: '1.2.3', current: '1.2.0' },
    { name: 'libnpm', current: 'MISSING', wanted: '1.0.0', latest: '1.2.0' }
  ])
  function updateDeps (names) {
    console.error('updating', names.join(', '))
  }
  return (
    <UpdatePicker
      outdated={outdated}
      stdin={stdin}
      unicode={unicode}
      onSubmit={updateDeps}
    />
  )
}

function UpdatePicker ({ outdated = [], stdin, onSubmit, unicode }) {
  return (
    <div>
      <Text bold>~ Select packages to update.</Text>
      <List stdin={stdin} onSubmit={onSubmit} unicode={unicode}>
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

function List ({ children = [], stdin, onSubmit, unicode }) {
  const cursorChar = unicode ? '❯' : '>'
  const checkedChar = unicode ? '◉' : '[x]'
  const uncheckedChar = unicode ? '◯' : '[ ]'
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
        const cursorIcon = cursor === i ? cursorChar : ' '
        const checkbox = selected.has(child.props.value)
          ? checkedChar
          : uncheckedChar
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
