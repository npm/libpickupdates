import React from 'react'
import { Color, Text } from 'ink'
import { Select, Option, OptGroup } from './select'
import semver from 'semver'

export default function UpdatePicker ({ outdated = {}, stdin, onSubmit, unicode }) {
  outdated = Object.keys(outdated).map(k => {
    return {
      name: k,
      ...(outdated[k])
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
            <Color red>{'\napi-breaking updates'}</Color>
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
            <Color blue>{'\nnew feature updates'}</Color>
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
            '\nbugfix updates'
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

function Outdated ({ item }) {
  return <Color green>{item.name}</Color>
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
