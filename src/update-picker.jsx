import React from 'react'
import { Color, Text } from 'ink'
import { Select, Option, OptGroup } from './select'
import semver from 'semver'

export default function UpdatePicker ({ outdated = [], stdin, onSubmit, unicode }) {
  const major = outdated.filter(out => out.current !== 'MISSING' && semver.diff(out.current, out.wanted) === 'major')
  const minor = outdated.filter(out => out.current !== 'MISSING' && semver.diff(out.current, out.wanted) === 'minor')
  const patch = outdated.filter(out => out.current !== 'MISSING' && semver.diff(out.current, out.wanted) === 'patch')
  const preDiffs = new Set([
    'premajor',
    'preminor',
    'prepatch',
    'prerelease'
  ])
  const pre = outdated.filter(out => out.current !== 'MISSING' && preDiffs.has(semver.diff(out.current, out.wanted)))
  const missing = outdated.filter(out => out.current === 'MISSING')
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
          missing.length && <OptGroup label={
            <Color yellow>{'\nneeds install'}</Color>
          }>
            {
              missing.map(out => {
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
