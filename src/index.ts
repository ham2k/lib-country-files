export * from './lib/parseCountryFile'
export * from './lib/analyzeFromCountryFile'
export * from './data/bigcty'
export * from './types'

import { setCountryFileData } from './lib/analyzeFromCountryFile'
import { BIGCTY } from './data/bigcty'

export function useBuiltinCountryFile (): void {
  setCountryFileData(BIGCTY)
}

