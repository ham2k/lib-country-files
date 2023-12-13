export * from './lib/parseCountryFile.js'
export * from './lib/analyzeFromCountryFile.js'
export * from './data/bigcty.js'

import { setCountryFileData } from './lib/analyzeFromCountryFile.js'
import { BIGCTY } from './data/bigcty.js'

export function useBuiltinCountryFile () {
  setCountryFileData(BIGCTY)
}
