export * from './lib/parseCountryFile'
export * from './lib/analyzeFromCountryFile'

import CTYData from './data/bigcty.json'

export function useBuiltinCountryFile () {
  setCountryFileData(CTYData)
}

export CTYData
