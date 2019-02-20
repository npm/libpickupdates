import React from 'react'
import { Color, Text } from 'ink'
import { Select, Option, OptGroup } from './select'
import semver from 'semver'

const types = [
  'dependencies',
  'optionalDependencies',
  'devDependencies'
]
export default function UpdatePicker ({ outdated = {}, stdin, onSubmit, unicode }) {
  outdated = Object.keys(outdated).map(k => {
    return {
      name: k,
      ...(outdated[k])
    }
  }).sort((x, y) => {
    if (x.type === y.type) {
      return 0
    } else if (types.indexOf(x.type) > types.indexOf(y.type)) {
      return 1
    } else {
      return -1
    }
  })
  const major = filterSemver(outdated, 'major')
  const minor = filterSemver(outdated, 'minor')
  const patch = filterSemver(outdated, 'patch')
  const preDiffs = new Set([
    'premajor',
    'preminor',
    'prepatch',
    'prerelease'
  ])
  const pre = filterSemver(outdated, preDiffs)
  const other = outdated.filter(out => !semver.valid(out.current) || !semver.valid(out.wanted))
  return (
    <div>
      <Text bold><Color green>?</Color> select packages to update</Text>
      <Select stdin={stdin} onSubmit={onSubmit} unicode={unicode}>
        {
          major.length && <OptGroup label={
            <Color red>{'\napi-breaking changes'}</Color>
          }>
            {
              major.map(out => {
                return (
                  <Option key={out.name} value={out.name}>
                    <Outdated item={out} />
                  </Option>
                )
              })
            }
          </OptGroup>
        }
        {
          minor.length && <OptGroup label={
            <Color blue>{'\nnew features'}</Color>
          }>
            {
              minor.map(out => {
                return (
                  <Option key={out.name} value={out.name}>
                    <Outdated item={out} />
                  </Option>
                )
              })
            }
          </OptGroup>
        }
        {
          patch.length && <OptGroup label={
            '\nbugfixes and other small changes'
          }>
            {
              patch.map(out => {
                return (
                  <Option key={out.name} value={out.name}>
                    <Outdated item={out} />
                  </Option>
                )
              })
            }
          </OptGroup>
        }
        {
          pre.length && <OptGroup label={
            '\nprerelease updates'
          }>
            {
              pre.map(out => {
                return (
                  <Option key={out.name} value={out.name}>
                    <Outdated item={out} />
                  </Option>
                )
              })
            }
          </OptGroup>
        }
        {
          other.length && <OptGroup label={
            <Color yellow>{'\nother'}</Color>
          }>
            {
              other.map(out => {
                return (
                  <Option key={out.name} value={out.name}>
                    <Outdated item={out} />
                  </Option>
                )
              })
            }
          </OptGroup>
        }
      </Select>
    </div>
  )
}

function Outdated ({
  item: {
    name, type, current, wanted, homepage
  }
}) {
  return (
    <Text>
      {name}
      {type && <Color green> {type.replace(/endencies/i, '')}</Color>}
      <Text bold> {current}</Text>
      {' >'}
      <Text bold> {wanted}</Text>
      <Color blue> {homepage}</Color>
    </Text>
  )
}

function filterSemver (outdated, type) {
  return outdated.filter(out => {
    return (
      semver.valid(out.wanted, true) &&
      semver.valid(out.current, true) &&
      (
        typeof type === 'string'
          ? semver.diff(out.current, out.wanted, true) === type
          : type.has(semver.diff(out.current, out.wanted, true))
      )
    )
  })
}
