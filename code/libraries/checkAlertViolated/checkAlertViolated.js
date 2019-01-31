function checkAlertViolated(nodeMsg, alertConfig, nodes) {
  if (!alertConfig) return false
  if (alertConfig.disabled) return false

  var ruleViolated = false;
  var rules = JSON.parse(alertConfig.rules)
  log("NUM RULES " + rules.length)
  rules.forEach(function (rule, i) {
    if (rule.node_id === nodeMsg.item_id) {
      var currentSensor = nodeMsg[rule.property]
    } else {
      var otherNode = nodes.filter(function(n) {
        return n.item_id === rule.node_id
      })[0]
      var currentSensor = otherNode[rule.property]
    }
    log('currentSensor ' + currentSensor)

    var payload = currentSensor
    var ruleValue = JSON.parse(rule.value)

    if (rule.operator == "GT") {
      ruleViolated = payload > ruleValue;
    } else if (rule.operator === "LT") {
      ruleViolated = payload < ruleValue;
    } else if (rule.operator === "EQ") {
      ruleViolated = payload === ruleValue;
    }

    log("rule" + (i + 1) + (ruleViolated ? " was violated:" : " is fine:     ") + " payload " + payload + " cannot be " + rule.operator + " ruleValue " + ruleValue)
  })

  return ruleViolated
}