const path = require("node:path")

function isUiFile(filename) {
  return filename.includes(`${path.sep}ui${path.sep}`)
}

module.exports = {
  meta: {
    type: "problem",
    docs: { description: "prevent ui layer from importing infrastructure" },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename()
    const fromUi = isUiFile(filename)
    return {
      ImportDeclaration(node) {
        if (!fromUi) return
        const source = node.source.value
        if (typeof source === "string" && source.includes("/infrastructure/")) {
          context.report({ node, message: "UI layers must not import infrastructure directly" })
        }
      },
    }
  },
}
