import { Color, Text } from 'ink'
import React, { useState } from 'react'
import { List, ListItem } from './list'

export default function UpdateInteractiveComponent ({ stdin, unicode }) {
  const [outdated, setOutdated] = useState([
    { name: 'lodash', wanted: '1.2.3', latest: '1.2.3', current: '1.2.0' },
    { name: 'libnpm', current: 'MISSING', wanted: '1.0.0', latest: '1.2.0' }
  ])
  const [updated, setUpdated] = useState(null)
  function updateDeps (names) {
    setUpdated(names)
    process.exit(0)
  }
  return (
    !updated
      ? <UpdatePicker
        outdated={outdated}
        stdin={stdin}
        unicode={unicode}
        onSubmit={updateDeps}
      />
      : <Text>Updated deps: {updated.join(', ')}</Text>
  )
}

function UpdatePicker ({ outdated = [], stdin, onSubmit, unicode }) {
  return (
    <div>
      <Text bold>? Select packages to update.</Text>
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
