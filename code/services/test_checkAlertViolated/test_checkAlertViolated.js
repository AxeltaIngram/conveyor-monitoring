
function test_checkAlertViolated(req, resp) {
  var expect = chai.expect

  var alertConfig = {
    disabled: true,
    rules: JSON.stringify([
      {
        "operator": "LT",
        "value": "32",
        "property": "temp1",
        "node_id": "myNode"
      }
    ])
  }
  var nodeData = { temp1: 20, item_id: "myNode" }
  expect(checkAlertViolated(nodeData, alertConfig), 'when disabled doesnt trigger').to.be.false

  alertConfig.disabled = false
  expect(checkAlertViolated(nodeData, alertConfig), 'LT, triggers alert').to.be.true

  nodeData.temp1 = 50
  expect(checkAlertViolated(nodeData, alertConfig), 'LT, doesnt trigger alert').to.be.false


  var alertConfig = {
    disabled: false,
    rules: JSON.stringify([
      {
        "operator": "EQ",
        "value": "32",
        "property": "temp1",
        "node_id": "myNode"
      }
    ])
  }
  nodeData.temp1 = 32
  expect(checkAlertViolated(nodeData, alertConfig), 'EQ, triggers alert').to.be.true

  nodeData.temp1 = 50
  expect(checkAlertViolated(nodeData, alertConfig), 'EQ, doesnt trigger alert').to.be.false




  var alertConfig = {
    disabled: false,
    rules: JSON.stringify([
      {
        "operator": "GT",
        "value": "32",
        "property": "temp1",
        "node_id": "myNode"
      }
    ])
  }
  nodeData.temp1 = 50
  expect(checkAlertViolated(nodeData, alertConfig), 'GT, triggers alert').to.be.true

  nodeData.temp1 = 10
  expect(checkAlertViolated(nodeData, alertConfig), 'GT, doesnt trigger alert').to.be.false


  var alertConfig = {
    disabled: false,
    rules: JSON.stringify([
      {
        "operator": "EQ",
        "value": "true",
        "property": "temp1"
      }
    ])
  }
  var nodeData = { temp1: true }
  expect(checkAlertViolated(nodeData, alertConfig), 'boolean, triggers alert').to.be.true

  var nodeData = { temp1: false }
  expect(checkAlertViolated(nodeData, alertConfig), 'boolean, doesnt trigger alert').to.be.false


  var alertConfig = {
    disabled: false,
    rules: JSON.stringify([
      {
        "operator": "GT",
        "value": "50",
        "property": "temp1"
      },
      {
        "operator": "LT",
        "value": "50",
        "property": "temp2"
      }
    ])
  }
  var nodeData = { temp1: 100, temp2: 10 }
  expect(checkAlertViolated(nodeData, alertConfig), 'multiple rules, triggers alert').to.be.true

  var nodeData = { temp1: 100, temp2: 100 }
  expect(checkAlertViolated(nodeData, alertConfig), 'multiple rules, one broken doesnt trigger alert').to.be.false

  var nodeData = { temp1: 10, temp2: 100 }
  expect(checkAlertViolated(nodeData, alertConfig), 'multiple rules, none broken doesnt trigger alert').to.be.false


  // when all not on node
  var alertConfig = {
    disabled: false,
    rules: JSON.stringify([
      {
        "operator": "GT",
        "value": "50",
        "property": "temp1",
      },
      {
        "operator": "LT",
        "value": "50",
        "property": "temp2",
        "node_id": "otherNode"
      }
    ])
  }
  var nodes = [{ item_id: "otherNode", temp2: 0 }]
  expect(checkAlertViolated(nodeData, alertConfig, nodes), 'multiple rules, broken from multiple nodes').to.be.true


  resp.success('All tests passed')

}
