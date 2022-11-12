let CTYIndexes = {}

function setCountryFileData(indexes) {
  CTYIndexes = indexes
}

function analyzeFromCountryFile(info, options = {}) {
  const { call, baseCall, prefix, preindicator, dxccCode } = info
  let match

  if (options.wae) {
    match = match || CTYIndexes.exactWAE[call]
  }
  match = match || CTYIndexes.exact[call]
  if (options.wae) {
    match = match || CTYIndexes.exactWAE[baseCall]
  }
  match = match || (baseCall && CTYIndexes.exact[baseCall])

  if (!match) {
    // If call had a prefix or postfix modifier that replaces the call prefix, then use that for lookup,
    // otherwise use the base part of the callsign, which has been stripped out of any other indicators
    let effectiveCall = baseCall || call || ""
    let effectivePrefix = preindicator || prefix // the preindicator can be longer than a prefix

    if (effectivePrefix && (!effectiveCall || !effectiveCall.startsWith(effectivePrefix)))
      effectiveCall = effectivePrefix

    let i = effectiveCall.length
    while (!match && i > 0) {
      if (options.wae) {
        match = CTYIndexes.prefixWAE[effectiveCall.slice(0, i)]
      }
      match = match || CTYIndexes.prefix[effectiveCall.slice(0, i)]
      i--
    }
  }

  // Special case: Guantanamo uses the KG4 prefix, but only for callsigns with 2 suffix letters
  if (match?.p === "KG4" && call.length !== 5 && !info?.postindicators?.includes("KG4")) {
    match = { p: "K" }
  }

  if (!match && dxccCode) {
    const entity = Object.values(CTYIndexes.entities).find((e) => e.dxccCode == dxccCode)
    if (entity) match = { p: entity.entityPrefix }
  }

  const parts = {}

  if (match?.p) {
    const entity = CTYIndexes.entities[match.p]
    parts.entityPrefix = entity.entityPrefix
    parts.entityName = entity.name
    parts.dxccCode = entity.dxccCode
    parts.continent = match.o || entity.continent
    parts.cqZone = match.c || entity.cqZone
    parts.ituZone = match.i || entity.ituZone
    parts.lat = match.y || entity.lat
    parts.lon = match.x || entity.lon
    parts.gmtOffset = entity.gmtOffset
    parts.locSource = "prefix"
  }
  return parts
}

function annotateFromCountryFile(info, options = {}) {
  const results = analyzeFromCountryFile(info, options)

  if (results) {
    Object.keys(results).forEach((key) => {
      if (info[key] && info[key] !== results[key]) {
        info[`${key}Original`] = info[key]
      }

      info[key] = results[key]
    })
  }

  return info
}

module.exports = {
  setCountryFileData,
  analyzeFromCountryFile,
  annotateFromCountryFile,
}
