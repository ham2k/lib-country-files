const { parseCountryFile } = require("./lib/parseCountryFile")
const { setCountryFileData, annotateFromCountryFile } = require("./lib/analyzeFromCountryFile")

module.exports = {
  annotateFromCountryFile,
  parseCountryFile,
  setCountryFileData,
}
