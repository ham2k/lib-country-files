const { setCountryFileData } = require("./lib/analyzeFromCountryFile")
const CTYData = require("./data/bigcty.json")

function useBuiltinCountryFile() {
  setCountryFileData(CTYData)
}

module.exports = {
  CTYData,
  useBuiltinCountryFile,
}
