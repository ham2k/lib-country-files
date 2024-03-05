import { parseCountryFile } from './parseCountryFile'
import fs from 'fs'

/* eslint-disable n/handle-callback-err */
const ctyCSV = fs.readFileSync('data/bigcty-20240229.csv', 'utf8', (err, data) => data)

describe('parseCountryFile', () => {
  it('should work', () => {
    const cty = parseCountryFile(ctyCSV)
    expect(Object.values(cty.entities).length).toEqual(346)

    expect(cty)
  })
})
