let CTYIndexes = {}

function setCountryFileData(indexes) {
  CTYIndexes = indexes
}

function annotateFromCountryFile(info, options = {}) {
  const { call, baseCall, prefix, preindicator, dxccCode } = info
  let match

  match = CTYIndexes.exact[call]
  if (options.wae) {
    match = match || CTYIndexes.exactWAE[call]
  }
  match = match || (baseCall && CTYIndexes.exact[baseCall])
  if (options.wae) {
    match = match || CTYIndexes.exactWAE[baseCall]
  }

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

  if (match?.p) {
    const entity = CTYIndexes.entities[match.p]
    info.entityPrefix = info.entityPrefix || entity.entityPrefix
    info.entityName = info.entityName || entity.name
    info.dxccCode = info.dxccCode || entity.dxccCode
    info.continent = info.continent || match.o || entity.continent
    info.cqZone = info.cqZone || match.c || entity.cqZone
    info.ituZone = info.ituZone || match.i || entity.ituZone
    info.lat = info.lat || match.y || entity.lat
    info.lon = info.lon || match.x || entity.lon
    info.gmtOffset = info.gmtOffset || entity.gmtOffset
    info.locSource = info.locSource || "prefix"
  }

  return info
}

module.exports = {
  setCountryFileData,
  annotateFromCountryFile,
}
