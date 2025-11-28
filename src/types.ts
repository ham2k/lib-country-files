import { ParsedCallsign } from "@ham2k/lib-callsigns"

export interface CFEntity {
  entityPrefix: string
  name: string
  dxccCode: number
  continent: string
  cqZone: number
  ituZone: number
  lat: number
  lon: number
  tz: string
  gmtOffset?: string
  isWAE?: boolean
  regionCode?: string
}

export interface CFMatch {
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

export interface CFIndexes {
  entities: Record<string, CFEntity>
  exact: Record<string, CFMatch>
  prefix: Record<string, CFMatch>
  prefixWAE: Record<string, CFMatch>
  exactWAE: Record<string, CFMatch>
}

export type CombinedCallInfo = ParsedCallsign & {
  isoPrefix?: string
  dxccCode?: number
  regionCode?: string
  state?: string
  entityPrefix?: string
  entityName?: string
  continent?: string
  cqZone?: number
  ituZone?: number
  lat?: number
  lon?: number
  gmtOffset?: string
  matchSource?: string
  matchNote?: string
  locSource?: string
}

export type AnnotatedCallInfo = CombinedCallInfo & {
  originalValues?: AnnotatedCallInfo
  cfValues?: AnnotatedCallInfo
}
