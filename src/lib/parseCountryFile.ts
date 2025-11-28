import { WAE_PREFIXES } from '../data/wae-data'
import type { CFIndexes, CFEntity } from '../types'

const END_OF_LINE_REGEXP = /\r?\n\s*/
const PREFIX_REGEXP = /(={0,1})([A-Z0-9/]+)(\(\d+\)){0,1}(\[\d+\]){0,1}/
const PARENS_REGEXP = /[()[\]]/

export interface Match {
  p: string // entity prefix
  c?: number // CQ zone override
  i?: number // ITU zone override
  o?: string // continent override
  y?: number // latitude override
  x?: number // longitude override
  matchSource?: string
  matchNote?: string
  regionCode?: string
}

export function parseCountryFile(data: string): CFIndexes {
  const lines = data.split(END_OF_LINE_REGEXP)
  const indexes: CFIndexes = {
    entities: {},
    exact: {},
    prefix: {},
    prefixWAE: {},
    exactWAE: {}
  }

  lines.forEach((line) => {
    const lineParts = line.split(',')
    if (lineParts.length > 9) {
      const entity: CFEntity = {
        entityPrefix: lineParts[0],
        name: lineParts[1],
        dxccCode: Number.parseInt(lineParts[2]),
        continent: lineParts[3],
        cqZone: Number.parseInt(lineParts[4]),
        ituZone: Number.parseInt(lineParts[5]),
        lat: Number.parseFloat(lineParts[6]),
        lon: Number.parseFloat(lineParts[7]),
        tz: ''
      }

      const offset = Number.parseFloat(lineParts[8])
      entity.tz = offset > 0 ? `GMT+${offset}` : `GMT${offset}`

      if (entity.entityPrefix.charAt(0) === '*') {
        entity.isWAE = true
      }

      indexes.entities[entity.entityPrefix] = entity

      lineParts[9]
        .replace(';', '')
        .split(' ')
        .forEach((prefix) => {
          const prefixParts = prefix.match(PREFIX_REGEXP)

          if (prefixParts) {
            const match: Match = { p: entity.entityPrefix }
            if (prefixParts[3]) match.c = Number.parseInt(prefixParts[3].replace(PARENS_REGEXP, ''))
            if (prefixParts[4]) match.i = Number.parseInt(prefixParts[4].replace(PARENS_REGEXP, ''))

            if (prefixParts[1] === '=') {
              if (entity.isWAE) {
                indexes.exactWAE[prefixParts[2]] = match
                // Exact matches for WAE prefixes should also be added to the non-WAE index
                if (WAE_PREFIXES[match.p]) {
                  indexes.exact[prefixParts[2]] = { ...match, p: WAE_PREFIXES[match.p] }
                }
              } else {
                indexes.exact[prefixParts[2]] = match
              }
            } else {
              if (entity.isWAE) {
                indexes.prefixWAE[prefixParts[2]] = match
              } else {
                indexes.prefix[prefixParts[2]] = match
              }
            }
          }
        })
    }
  })

  return indexes
}

