const { parseCountryFile } = require('../src/lib/parseCountryFile')
const fs = require('fs')
const path = require('path')

console.log('Preprocessing Country File')

/* eslint-disable n/handle-callback-err */
const ctyCSV = fs.readFileSync(path.join(__dirname, '../data/bigcty-20230330.csv'), 'utf8', (err, data) => data)

const indexes = parseCountryFile(ctyCSV)

fs.writeFileSync(path.join(__dirname, '../src/data/bigcty.json'), JSON.stringify(indexes), 'utf8')

console.log('Done. Output written to data/bigcty.json')
