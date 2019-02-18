import { Box, Color, Text } from 'ink'
import React, { useEffect, useState } from 'react'

export function Select ({ children = [], stdin, onSubmit, unicode }) {
  const cursorChar = unicode ? '❯' : '>'
  const checkedChar = <Color green>{unicode ? '◉' : '[x]'}</Color>
  const uncheckedChar = unicode ? '◯' : '[ ]'
  const [selected, setSelected] = useState(new Set())
  const [cursor, setCursor] = useState(0)
  const items = children.reduce((acc, child) => {
    if (child.type === OptGroup) {
      return acc.concat(child.props.children)
    } else if (child) {
      return acc.concat([child])
    } else {
      return acc
    }
  }, [])

  useKeypress(stdin, (data, key) => {
    if (key.name === 'up') {
      setCursor(cursor === 0
        ? items.length && items.length - 1
        : cursor - 1
      )
    } else if (key.name === 'down') {
      setCursor((cursor + 1) % items.length)
    } else if (data === ' ' && items.length) {
      const val = items[cursor].props.value
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

  function renderItem (item, i) {
    const cursorIcon = cursor === i ? cursorChar : ' '
    const checkbox = selected.has(item.props.value)
      ? checkedChar
      : uncheckedChar
    return (
      <Box key={`${item.props.value}-box`}>
        {cursorIcon} {checkbox} {item}
      </Box>
    )
  }

  return (
    <Box flexDirection='column'>
      {children.filter(x => x).map((child, i) => {
        if (child.type === OptGroup) {
          return (
            <Box key={i} flexDirection={'column'}>
              <Text bold>{child.props.label}</Text>
              {child.props.children.map(c => renderItem(c, items.indexOf(c)))}
            </Box>
          )
        } else {
          return renderItem(child, items.indexOf(child))
        }
      })}
    </Box>
  )
}

export function Option ({ selected, active, children }) {
  return <Box>{children}</Box>
}

export function OptGroup ({ children }) {
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
