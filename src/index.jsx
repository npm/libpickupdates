import { Color, Text } from 'ink'
import Spinner from 'ink-spinner'
import React, { useEffect, useState } from 'react'
import UpdatePicker from './update-picker'

const STATES = {
  init: 'init',
  pickUpdates: 'pick-updates',
  updating: 'updating',
  updated: 'updated',
  alreadyUpToDate: 'already-up-to-date'
}

export default function PickUpdatesComponent ({ stdin, onDone, unicode }) {
  const [state, setState] = useState(STATES.init)
  const [outdated, setOutdated] = useState(null)
  const [updated, setUpdated] = useState([])
  useEffect(getOutdated)
  function getOutdated () {
    setTimeout(() => {
      setOutdated([
        {
          name: 'lodash',
          wanted: '1.2.3',
          latest: '1.2.3',
          current: '1.2.0'
        },
        {
          name: 'libnpm',
          current: 'MISSING',
          wanted: '1.0.0',
          latest: '1.2.0'
        }
      ])
    }, 1500)
  }
  function updateDeps (names) {
    setImmediate(() => setState(STATES.updating))
    setUpdated(names)
  }
  if (state === STATES.init) {
    if (outdated && outdated.length) {
      setState(STATES.pickUpdates)
    } else if (outdated) {
      setState(STATES.alreadyUpToDate)
    }
    return <Text><Color green><Spinner /></Color> Checking dependency updates.</Text>
  } else if (state === STATES.pickUpdates) {
    return <UpdatePicker
      outdated={outdated}
      stdin={stdin}
      unicode={unicode}
      onSubmit={updateDeps}
    />
  } else if (state === STATES.alreadyUpToDate) {
    setImmediate(onDone)
    return <Text>Already up to date!</Text>
  } else if (state === STATES.updating) {
    setTimeout(() => setState(STATES.updated), 2000)
    return <Text><Color green><Spinner /></Color> Installing updated deps...</Text>
  } else if (state === STATES.updated) {
    setImmediate(onDone)
    return <Text>Updated deps: {updated.join(', ')}</Text>
  } else {
    return <Text>...</Text>
  }
}
