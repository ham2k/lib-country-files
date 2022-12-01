const { parseCountryFile } = require("./lib/parseCountryFile")
const { setCountryFileData, annotateFromCountryFile, fillDXCCfromCountryFile } = require("./lib/analyzeFromCountryFile")

module.exports = {
  annotateFromCountryFile,
  parseCountryFile,
  fillDXCCfromCountryFile,
  setCountryFileData,
}
