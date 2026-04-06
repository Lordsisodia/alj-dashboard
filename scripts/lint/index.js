module.exports = {
  rules: {
    "no-portal-imports": require("./rules/no-portal-imports"),
  },
}
module.exports.rules["no-ui-infra-imports"] = require("./rules/no-ui-infrastructure-imports")
