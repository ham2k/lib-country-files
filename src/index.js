const { parseCountryFile } = require('./lib/parseCountryFile')
const { setCountryFileData, annotateFromCountryFile, fillDXCCFromCountryFile } = require('./lib/analyzeFromCountryFile')
const { setCountryFileData } = require('./lib/analyzeFromCountryFile')
const CTYData = require('./data/bigcty.json')

function useBuiltinCountryFile () {
  setCountryFileData(CTYData)
}

module.exports = {
  annotateFromCountryFile,
  parseCountryFile,
  fillDXCCFromCountryFile,
  setCountryFileData
  CTYData,
  useBuiltinCountryFile
}
