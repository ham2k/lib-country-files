import { CQWW_ENTITIES_BY_PREFIX } from '@ham2k/lib-cqmag-data'

import { CQZONES_FOR_STATES } from '../data/cqzonesForStates.js'

const WAE_IOTA = Object.values(CQWW_ENTITIES_BY_PREFIX)
  .filter(x => x.iota)
  .reduce((h, x) => ({...h, [x.iota]: x, [x.iota2 ?? x.iota]: x}), {})
const WAE_REGIONS = Object.values(CQWW_ENTITIES_BY_PREFIX)
  .filter(x => x.regionCode)
  .reduce((h, x) => ({...h, [x.regionCode]: x}), {})

let CTYIndexes = {}
let DXCC_ENTITIES_BY_CODE = {}

export function setCountryFileData (indexes) {
  CTYIndexes = indexes
  DXCC_ENTITIES_BY_CODE = Object.values(indexes.entities)
    .filter((e) => !e.isWAE)
    .reduce((h, e) => ({...h, [e.dxccCode]: e}), {})

  Object.values(WAE_REGIONS).forEach(x => {
    CTYIndexes.entities[x.entityPrefix].regionCode = x.regionCode
  })
}

export function analyzeFromCountryFile (info, options = {}) {
  const { call, baseCall, prefix, preindicator, dxccCode, regionCode, state, entityPrefix } = info
  let match

  if (options.wae) {
    match = match ?? CTYIndexes.exactWAE[call]
  }
  match = match ?? CTYIndexes.exact[call]
  if (options.wae) {
    match = match ?? CTYIndexes.exactWAE[baseCall]
  }
  match = match ?? (baseCall && CTYIndexes.exact[baseCall])

  if (match) {
    match.matchSource = 'exact'
  }

  if (!match) {
    // If call had a prefix or postfix modifier that replaces the call prefix, then use that for lookup,
    // otherwise use the base part of the callsign, which has been stripped out of any other indicators
    let effectiveCall = baseCall ?? call ?? ''
    const effectivePrefix = preindicator ?? prefix // the preindicator can be longer than a prefix

    if (effectivePrefix && (!effectiveCall || !effectiveCall.startsWith(effectivePrefix))) { effectiveCall = effectivePrefix }

    let i = effectiveCall.length
    while (!match && i > 0) {
      if (options.wae) {
        match = CTYIndexes.prefixWAE[effectiveCall.slice(0, i)]
      }
      match = match ?? CTYIndexes.prefix[effectiveCall.slice(0, i)]
      i--
    }
    if (match) {
      match.matchSource = 'prefix'
    }

    // We only override with Region or IOTA if the match is not an exact match
    if (options?.wae) {
      if (regionCode && WAE_REGIONS[regionCode]) {
        match = { ...match, p: WAE_REGIONS[regionCode].entityPrefix, matchSource: 'wae region', matchNote: `ADIF references Region Code ${regionCode}` }
      } else if (options?.refs?.iota) {
        const iota = Object.keys(options.refs.iota).find((key) => WAE_IOTA[key])
        if (iota) {
          match = { ...match, p: WAE_IOTA[iota].entityPrefix, matchSource: 'wae iota', matchNote: `ADIF references IOTA ${iota}` }
        }
      }
    }
  }

  // Special case: Guantanamo uses the KG4 prefix, but only for callsigns with 2 suffix letters
  if (match?.p === 'KG4' && call && call.length !== 5 && !info?.postindicators?.includes('KG4')) {
    match = { p: 'K', matchSource: 'exception', matchNote: 'Guantanamo uses KG4 prefix, but only for callsigns with 2 suffix letters' }
  }

  if (!match && CTYIndexes.entities[entityPrefix]) {
    match = { p: entityPrefix, matchSource: 'entity prefix' }
  }

  if (!match && dxccCode && DXCC_ENTITIES_BY_CODE[dxccCode]) {
    match = { p: DXCC_ENTITIES_BY_CODE[dxccCode].entityPrefix, matchSource: 'dxcc code' }
  }

  const parts = {}

  if (match?.p && CTYIndexes.entities[match.p]) {
    const entity = CTYIndexes.entities[match.p]
    parts.entityPrefix = entity.entityPrefix
    parts.entityName = entity.name
    parts.dxccCode = entity.dxccCode
    parts.continent = match.o ?? entity.continent
    parts.cqZone = match.c ?? entity.cqZone
    parts.ituZone = match.i ?? entity.ituZone
    if (match.regionCode ?? entity.regionCode) parts.regionCode = match.regionCode ?? entity.regionCode
    parts.lat = match.y ?? entity.lat
    parts.lon = match.x ?? entity.lon
    parts.gmtOffset = entity.gmtOffset
    if (match.matchSource) parts.matchSource = match.matchSource
    if (match.matchNote) parts.matchNote = match.matchNote
    parts.locSource = 'prefix'
  }

  if (state && CQZONES_FOR_STATES[parts.entityName]) {
    const altZone = CQZONES_FOR_STATES[parts.entityName][state.toUpperCase()]
    if (altZone && altZone !== parts.cqZone) {
      parts.cqZone = altZone
    }
  }

  return parts
}

export function annotateFromCountryFile (info, options = {}) {
  const results = analyzeFromCountryFile(info, options)
  const destination = options.destination ?? info

  if (results) {
    Object.keys(results).forEach((key) => {
      if (destination[key] && destination[key] !== results[key]) {
        if (options.override !== false) {
          destination[`${key}Original`] = destination[key]
          destination[key] = results[key]
        } else {
          destination[`${key}CountryFiles`] = results[key]
        }
      } else {
        destination[key] = results[key]
      }
    })
  }

  return destination
}
