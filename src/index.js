const { parseCountryFile } = require('./lib/parseCountryFile')
const { setCountryFileData, annotateFromCountryFile, fillDXCCFromCountryFile } = require('./lib/analyzeFromCountryFile')

module.exports = {
  annotateFromCountryFile,
  parseCountryFile,
  fillDXCCFromCountryFile,
  setCountryFileData
}
