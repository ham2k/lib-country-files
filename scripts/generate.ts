import { parseCountryFile } from '../src/lib/parseCountryFile'
import fs from 'fs'

console.log('Preprocessing Country File')

const ctyCSV = fs.readFileSync('data/bigcty-20251125.csv', 'utf8')

const indexes = parseCountryFile(ctyCSV)

fs.writeFileSync('src/data/bigcty.json', JSON.stringify(indexes), 'utf8')
fs.writeFileSync('src/data/bigcty.ts', `import type { CFIndexes } from '../types'\n\nexport const BIGCTY: CFIndexes = ${JSON.stringify(indexes)}`, 'utf8')

console.log('Done. Output written to data/bigcty.json and data/bigcty.ts')

