import { parseCountryFile } from '../src/lib/parseCountryFile.js'
import fs from 'fs'
import path from 'path'

console.log('Preprocessing Country File')

/* eslint-disable n/handle-callback-err */
const ctyCSV = fs.readFileSync('data/bigcty-20241015.csv', 'utf8', (err, data) => data)

const indexes = parseCountryFile(ctyCSV)

fs.writeFileSync('src/data/bigcty.json', JSON.stringify(indexes), 'utf8')
fs.writeFileSync('src/data/bigcty.js', `export const BIGCTY = ${JSON.stringify(indexes)}`, 'utf8')

console.log('Done. Output written to data/bigcty.json')
