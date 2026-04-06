module.exports = {
  meta: {
    type: "problem",
    docs: { description: "disallow runtime imports from portal-architecture" },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (typeof source === "string" && source.includes("portal-architecture")) {
          context.report({ node, message: "Do not import from portal-architecture in runtime code" })
        }
      },
    }
  },
}
