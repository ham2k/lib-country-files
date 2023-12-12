export * from './lib/parseCountryFile'
export * from './lib/analyzeFromCountryFile'

import { setCountryFileData } from './lib/parseCountryFile'
import bigcty from './data/bigcty.json'

export function useBuiltinCountryFile () {
  setCountryFileData(bigcty)
}

export const CTYData = bigcty
