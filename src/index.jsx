import { Text } from 'ink'
import React, { useState } from 'react'
import UpdatePicker from './update-picker'

const STATES = {
  init: 'init',
  pickUpdates: 'pick-updates',
  updating: 'updating',
  updated: 'updated',
  alreadyUpToDate: 'already-up-to-date'
}

export default function PickUpdatesComponent ({ stdin, unicode }) {
  const [state, setState] = useState(STATES.init)
  const [outdated, setOutdated] = useState([
    { name: 'lodash', wanted: '1.2.3', latest: '1.2.3', current: '1.2.0' },
    { name: 'libnpm', current: 'MISSING', wanted: '1.0.0', latest: '1.2.0' }
  ])
  const [updated, setUpdated] = useState(null)
  function updateDeps (names) {
    setUpdated(names)
    setState(STATES.updating)
  }
  if (state === STATES.init) {
    setTimeout(() => {
      if (outdated.length) {
        setState(STATES.pickUpdates)
      } else {
        setState(STATES.alreadyUpToDate)
      }
    }, 2000)
    return <Text>Loading...</Text>
  } else if (state === STATES.pickUpdates) {
    return <UpdatePicker
      outdated={outdated}
      stdin={stdin}
      unicode={unicode}
      onSubmit={updateDeps}
    />
  } else if (state === STATES.alreadyUpToDate) {
    setImmediate(() => process.exit(0))
    return <Text>Already up to date!</Text>
  } else if (state === STATES.updating) {
    setTimeout(() => setState(STATES.updated), 2000)
    return <Text>Installing updated deps...</Text>
  } else if (state === STATES.updated) {
    setImmediate(() => process.exit(0))
    return <Text>Updated deps: {updated.join(', ')}</Text>
  }
}
