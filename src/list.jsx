import { Box } from 'ink'
import React, { useEffect, useState } from 'react'

export function List ({ children = [], stdin, onSubmit, unicode }) {
  const cursorChar = unicode ? '❯' : '>'
  const checkedChar = unicode ? '◉' : '[x]'
  const uncheckedChar = unicode ? '◯' : '[ ]'
  const [selected, setSelected] = useState(new Set())
  const [cursor, setCursor] = useState(0)
  useKeypress(stdin, (data, key) => {
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
    } else if (key.name === 'return') {
      onSubmit([...selected])
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

export function ListItem ({ selected, active, children }) {
  return <Box>{children}</Box>
}

function useKeypress (stdin, cb) {
  useEffect(() => {
    stdin.on('keypress', cb)
    return () => {
      stdin.removeListener('keypress', cb)
    }
  })
}
