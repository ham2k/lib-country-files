const { parseCountryFile } = require('./parseCountryFile')
const fs = require('fs')
const path = require('path')

/* eslint-disable n/handle-callback-err */
const ctyCSV = fs.readFileSync(path.join(__dirname, '../../data/bigcty-20230330.csv'), 'utf8', (err, data) => data)

describe('parseCountryFile', () => {
  it('should work', () => {
    const cty = parseCountryFile(ctyCSV)
    expect(Object.values(cty.entities).length).toEqual(346)

    expect(cty)
  })
})
