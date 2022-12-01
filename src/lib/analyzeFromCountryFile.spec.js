const { analyzeFromCountryFile, annotateFromCountryFile, setCountryFileData } = require("./analyzeFromCountryFile")
const CTYData = require("../data/bigcty.json")

setCountryFileData(CTYData)

describe("Country File analyzis and annotation", () => {
  describe("analyzeFromCountryFile", () => {
    it("should work", () => {
      const info = analyzeFromCountryFile({ call: "KI2D", baseCall: "KI2D", prefix: "KI2", isoPrefix: "KI" })
      expect(info.entityPrefix).toEqual("K")
      expect(info.entityName).toEqual("United States")
    })

    it("should find the Country File version", () => {
      const info = analyzeFromCountryFile({ call: "VERSION" })
      expect(info.entityName).toEqual("Marshall Islands")
    })

    it("should annotate from a DXCC code", () => {
      const info = analyzeFromCountryFile({ dxccCode: 291 })
      expect(info.entityPrefix).toEqual("K")
      expect(info.entityName).toEqual("United States")
      expect(info.cqZone).toEqual(5)
      expect(info.ituZone).toEqual(8)
    })

    it("should annotate from a prefix code", () => {
      const info = analyzeFromCountryFile({ prefix: "YV" })
      expect(info.entityPrefix).toEqual("YV")
      expect(info.entityName).toEqual("Venezuela")
      expect(info.cqZone).toEqual(9)
      expect(info.ituZone).toEqual(12)
    })

    it("should know about exact callsign exceptions", () => {
      // Your regular KP3 callsign should match to Puerto Rico
      let info = analyzeFromCountryFile({ call: "KP3Z", baseCall: "KP3Z", prefix: "KP3", isoPrefix: "KP" })
      expect(info.entityPrefix).toEqual("KP4")
      expect(info.cqZone).toEqual(8)

      // But KP3Y lives in the continental US
      info = analyzeFromCountryFile({ call: "KP3Y", baseCall: "KP3Y", prefix: "KP3", isoPrefix: "KP" })
      expect(info.entityPrefix).toEqual("K")
      expect(info.cqZone).toEqual(5)

      // Some callsign exceptions include modifiers
      info = analyzeFromCountryFile({ call: "SV2/SV1RP/T", baseCall: "SV1RP", prefix: "SV2" })
      expect(info.entityPrefix).toEqual("SV/a")
    })

    it("should know about zones for US States", () => {
      let info = analyzeFromCountryFile({ call: "N6RANDOM", baseCall: "N6RANDOM", prefix: "N6", isoPrefix: "N" })
      expect(info.entityPrefix).toEqual("K")
      expect(info.cqZone).toEqual(3)

      info = analyzeFromCountryFile({ call: "N0RANDOM", baseCall: "N0RANDOM", prefix: "N0", isoPrefix: "N" })
      expect(info.entityPrefix).toEqual("K")
      expect(info.cqZone).toEqual(4)

      info = analyzeFromCountryFile({ call: "N2RANDOM", baseCall: "N2RANDOM", prefix: "N2", isoPrefix: "N" })
      expect(info.entityPrefix).toEqual("K")
      expect(info.cqZone).toEqual(5)
    })

    it("should work with regional suffixes (letter past the digit)", () => {
      let info = analyzeFromCountryFile({ call: "UQ9X", baseCall: "UQ9X", prefix: "UQ9", isoPrefix: "UQ" })
      expect(info.entityPrefix).toEqual("UN")
      expect(info.ituZone).toEqual(30)

      info = analyzeFromCountryFile({ call: "UQ9Q", baseCall: "UQ9Q", prefix: "UQ9", isoPrefix: "UQ" })
      expect(info.entityPrefix).toEqual("UN")
      expect(info.ituZone).toEqual(31)

      info = analyzeFromCountryFile({ call: "VP2EAAA", baseCall: "VP2EAAA", prefix: "VP2", isoPrefix: "VP" })
      expect(info.entityPrefix).toEqual("VP2E")

      info = analyzeFromCountryFile({ call: "VP2EAAA", baseCall: "VP2EAAA", prefix: "VP2", isoPrefix: "VP" })
      expect(info.entityPrefix).toEqual("VP2E")
    })

    it("should know about the extended list of countries used for WAE contests", () => {
      let info = analyzeFromCountryFile({ call: "IG9AAA" })
      expect(info.entityPrefix).toEqual("I") // Italy
      expect(info.ituZone).toEqual(28)
      expect(info.continent).toEqual("EU")

      info = analyzeFromCountryFile({ call: "IG9AAA" }, { wae: true })
      expect(info.entityPrefix).toEqual("*IG9") // Italian Africa
      expect(info.ituZone).toEqual(37)
      expect(info.continent).toEqual("AF")

      info = analyzeFromCountryFile({ call: "IH9YMC" }, { wae: true })
      expect(info.entityPrefix).toEqual("*IG9") // Italian Africa
      expect(info.ituZone).toEqual(37)
      expect(info.continent).toEqual("AF")

      info = analyzeFromCountryFile({ call: "II0OGB" }, { wae: true })
      expect(info.entityPrefix).toEqual("*IT9") // Sicily
      expect(info.ituZone).toEqual(28)
      expect(info.continent).toEqual("EU")

      info = analyzeFromCountryFile({ call: "IT4LY" }, { wae: true, iota: "EU-025" })
      expect(info.entityPrefix).toEqual("*IT9") // Sicily
      expect(info.ituZone).toEqual(28)
      expect(info.continent).toEqual("EU")

      info = analyzeFromCountryFile({ call: "4U1A" }, { wae: false })
      expect(info.entityPrefix).toEqual("OE") // Austria
      expect(info.ituZone).toEqual(28)
      expect(info.continent).toEqual("EU")

      info = analyzeFromCountryFile({ call: "4U1A" }, { wae: true })
      expect(info.entityPrefix).toEqual("*4U1V") // UN Vienna
      expect(info.ituZone).toEqual(28)
      expect(info.continent).toEqual("EU")
    })

    it("should handle Guantanamo as a special case", () => {
      let info
      // Guantanamo callsigns use KG4, but with a 2 letter suffix. One and three letters are regular USA calls
      info = analyzeFromCountryFile({ call: "KG4AB" })
      expect(info.entityPrefix).toEqual("KG4")

      info = analyzeFromCountryFile({ call: "KG4A" })
      expect(info.entityPrefix).toEqual("K")

      info = analyzeFromCountryFile({ call: "KG4ABC" })
      expect(info.entityPrefix).toEqual("K")

      info = analyzeFromCountryFile({ call: "N0CALL/KG4", postindicators: ["KG4"], prefix: "KG4" })
      expect(info.entityPrefix).toEqual("KG4")

      info = analyzeFromCountryFile({ call: "KG4ABC/KG4", postindicators: ["KG4"], prefix: "KG4" })
      expect(info.entityPrefix).toEqual("KG4")
    })

    it("should handle prefixed calls", () => {
      let info
      info = analyzeFromCountryFile({
        call: "VP2V/N0CALL",
        baseCall: "N0CALL",
        ituPrefix: "VP",
        prefix: "VP2",
        preindicator: "VP2V",
      })
      expect(info.entityPrefix).toEqual("VP2V")
    })

    it("should get correct zones for US States", () => {
      let info
      // Generic KL7 call
      info = analyzeFromCountryFile({ call: "KL7SANTA" })
      expect(info.cqZone).toEqual(1)

      // Call that has an exception in Country Files
      info = analyzeFromCountryFile({ call: "KL7CX" })
      expect(info.cqZone).toEqual(4)

      // Override if state is given
      info = analyzeFromCountryFile({ call: "KL7CX" }, { state: "MA" })
      expect(info.cqZone).toEqual(5)
    })
  })

  describe("annotateFromCountryFile", () => {
    it("should manage conflicts with existing info", () => {
      let info = {
        call: "N0CALL",
        entityPrefix: "VE",
      }
      annotateFromCountryFile(info)
      expect(info.entityPrefix).toEqual("K")
      expect(info.entityPrefixOriginal).toEqual("VE")

      info = {
        call: "N0CALL",
        entityPrefix: "K",
        entityName: "USA",
      }
      annotateFromCountryFile(info)
      expect(info.entityPrefix).toEqual("K")
      expect(info.entityPrefixOriginal).toEqual(undefined)
      expect(info.entityName).toEqual("United States")
      expect(info.entityNameOriginal).toEqual("USA")
    })
  })
})
