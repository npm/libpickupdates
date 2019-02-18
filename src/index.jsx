import { Color, Text } from 'ink'
import Spinner from 'ink-spinner'
import React, { useState } from 'react'
import UpdatePicker from './update-picker'

const STATES = {
  init: 'init',
  fetchOutdated: 'fetch-outdated',
  pickUpdates: 'pick-updates',
  updating: 'updating',
  updated: 'updated',
  alreadyUpToDate: 'already-up-to-date'
}

export default function PickUpdatesComponent ({
  stdin, onDone, unicode, getOutdated, installUpdates
}) {
  const [state, setState] = useState(STATES.init)
  const [outdated, setOutdated] = useState(null)
  const [updated, setUpdated] = useState([])
  function updateDeps (names) {
    setState(STATES.updating)
    installUpdates(names).then(() => {
      setState(STATES.updated)
    })
    setUpdated(names)
  }
  if (state === STATES.init) {
    getOutdated().then(setOutdated)
    setState(STATES.fetchOutdated)
  } else if (state === STATES.fetchOutdated) {
    if (outdated && Object.keys(outdated).length) {
      setState(STATES.pickUpdates)
    } else if (outdated) {
      setState(STATES.alreadyUpToDate)
    }
    return <Text><Color green><Spinner /></Color> checking dependency updates</Text>
  } else if (state === STATES.pickUpdates) {
    return <UpdatePicker
      outdated={outdated}
      stdin={stdin}
      unicode={unicode}
      onSubmit={updateDeps}
    />
  } else if (state === STATES.alreadyUpToDate) {
    setImmediate(onDone)
    return <Text>already up to date!</Text>
  } else if (state === STATES.updating) {
    return <Text><Color green><Spinner /></Color> installing updated deps</Text>
  } else if (state === STATES.updated) {
    setImmediate(onDone)
    return <Text>updated {updated.length} deps</Text>
  } else {
    return <Text>...</Text>
  }
}
