const { CQZONES_FOR_STATES } = require("../data/cqz-for-states.json")
const WAE_IOTA = require("../data/wae-iota.json")

let CTYIndexes = {}

function setCountryFileData(indexes) {
  CTYIndexes = indexes
}

function analyzeFromCountryFile(info, options = {}) {
  const { call, baseCall, prefix, preindicator, dxccCode } = info
  let match

  if (options.wae) {
    match = match ?? CTYIndexes.exactWAE[call]
  }
  match = match ?? CTYIndexes.exact[call]
  if (options.wae) {
    match = match ?? CTYIndexes.exactWAE[baseCall]
  }
  match = match ?? (baseCall && CTYIndexes.exact[baseCall])

  if (!match) {
    // If call had a prefix or postfix modifier that replaces the call prefix, then use that for lookup,
    // otherwise use the base part of the callsign, which has been stripped out of any other indicators
    let effectiveCall = baseCall ?? call ?? ""
    let effectivePrefix = preindicator ?? prefix // the preindicator can be longer than a prefix

    if (effectivePrefix && (!effectiveCall || !effectiveCall.startsWith(effectivePrefix)))
      effectiveCall = effectivePrefix

    let i = effectiveCall.length
    while (!match && i > 0) {
      if (options.wae) {
        match = CTYIndexes.prefixWAE[effectiveCall.slice(0, i)]
      }
      match = match ?? CTYIndexes.prefix[effectiveCall.slice(0, i)]
      i--
    }
  }

  // Special case: Guantanamo uses the KG4 prefix, but only for callsigns with 2 suffix letters
  if (match?.p === "KG4" && call.length !== 5 && !info?.postindicators?.includes("KG4")) {
    match = { p: "K" }
  }

  if (options?.wae && options?.iota) {
    if (WAE_IOTA[options?.iota]) {
      match = { p: WAE_IOTA[options?.iota] }
    }
  }

  if (!match && dxccCode) {
    const entity = Object.values(CTYIndexes.entities).find((e) => e.dxccCode == dxccCode && !e.isWAE)
    if (entity) match = { p: entity.entityPrefix }
  }

  const parts = {}

  if (match?.p) {
    const entity = CTYIndexes.entities[match.p]
    parts.entityPrefix = entity.entityPrefix
    parts.entityName = entity.name
    parts.dxccCode = entity.dxccCode
    parts.continent = match.o ?? entity.continent
    parts.cqZone = match.c ?? entity.cqZone
    parts.ituZone = match.i ?? entity.ituZone
    parts.lat = match.y ?? entity.lat
    parts.lon = match.x ?? entity.lon
    parts.gmtOffset = entity.gmtOffset
    parts.locSource = "prefix"
  }

  if (options?.state && CQZONES_FOR_STATES[parts.entityName]) {
    const altZone = CQZONES_FOR_STATES[parts.entityName][options.state.toUpperCase()]
    if (altZone && altZone !== parts.cqZone) {
      parts.cqZone = altZone
    }
  }

  return parts
}

function annotateFromCountryFile(info, options = {}) {
  const results = analyzeFromCountryFile(info, options)
  const destination = options.destination ?? info

  if (results) {
    Object.keys(results).forEach((key) => {
      if (destination[key] && destination[key] !== results[key]) {
        destination[`${key}Original`] = destination[key]
      }

      destination[key] = results[key]
    })
  }

  return destination
}

function fillDXCCfromCountryFile(dxccCode, destination = {}) {
  const entity = Object.values(CTYIndexes.entities).find((e) => e.dxccCode == dxccCode && !e.isWAE)
  if (entity) {
    destination.entityPrefix = destination.entityPrefix ?? entity.entityPrefix
    destination.entityName = destination.entityName ?? entity.name
    destination.dxccCode = destination.dxccCode ?? entity.dxccCode
    destination.continent = destination.continent ?? entity.continent
    destination.cqZone = destination.cqZone ?? entity.cqZone
    destination.ituZone = destination.ituZone ?? entity.ituZone
    destination.lat = destination.lat ?? entity.lat
    destination.lon = destination.lon ?? entity.lon
    destination.gmtOffset = destination.gmtOffset ?? entity.gmtOffset
  }
  return destination
}

module.exports = {
  setCountryFileData,
  analyzeFromCountryFile,
  annotateFromCountryFile,
  fillDXCCfromCountryFile,
}
