declare module '@ham2k/lib-cqmag-data' {
  export interface CQWWEntity {
    entityPrefix: string
    iota?: string
    iota2?: string
    regionCode?: string
  }

  export const CQWW_ENTITIES_BY_PREFIX: Record<string, CQWWEntity>
}

