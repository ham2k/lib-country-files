export * from './lib/parseCountryFile.js'
export * from './lib/analyzeFromCountryFile.js'

import { setCountryFileData } from './lib/parseCountryFile.js'
import bigcty from './data/bigcty.json' assert { type: 'json' }

export function useBuiltinCountryFile () {
  setCountryFileData(bigcty)
}

export const CTYData = bigcty
