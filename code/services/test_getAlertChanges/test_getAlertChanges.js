function test_getAlertChanges(req, resp) {
  var expect = chai.expect
  chai.use(chai_subset)

  var alertConfigs = [{
    item_id: 'myLTalert',
    rules: JSON.stringify([
      {
        "operator": "LT",
        "value": "50",
        "property": "temp1",
        "node_id": 'myNode'
      }
    ])
  },
  {
    item_id: 'myGTalert',
    rules: JSON.stringify([
      {
        "operator": "GT",
        "value": "50",
        "property": "temp2",
        "node_id": 'myNode'
      }
    ])
  }]
  var nodeData = { temp1: 20, item_id: 'myNode' }
  expect(getAlertChanges(nodeData, alertConfigs, [])[0].newAlert, 'when disabled doesnt trigger').to.containSubset({
    is_active: true,
    configuration_id: "myLTalert"
  })

  expect(getAlertChanges(nodeData, alertConfigs, [{ configuration_id: "myLTalert" }]), 'does nothing when no already an event').to.have.length(0)

  var nodeData = { temp1: 70, item_id: 'myNode' }

  expect(getAlertChanges(nodeData, alertConfigs, []), 'does nothing when not violating alert').to.have.length(0)

  expect(getAlertChanges(nodeData, alertConfigs, [{ configuration_id: "myLTalert" }]), 'does nothing when not violating alert with an exisiting aler').to.have.length(0)


  var nodeData = { temp1: 20, temp2: 70, item_id: 'myNode' }
  expect(getAlertChanges(nodeData, alertConfigs, []), 'create multiple alert when multiple alert defintions met').to.have.length(2)


  // not all alert config on same node

  var alertConfigs = [{
    item_id: 'myLTalert',
    rules: JSON.stringify([
      {
        "operator": "LT",
        "value": "50",
        "property": "temp1",
        "node_id": 'myNode'
      },       {
        "operator": "GT",
        "value": "50",
        "property": "temp2",
        "node_id": 'aDifferentNode'
      }
    ])
  }]
  var nodeData = { temp1: 20, item_id: 'myNode' }
  var otherNodes = [{ item_id: 'aDifferentNode', temp2: 70}]
  expect(getAlertChanges(nodeData, alertConfigs, [], otherNodes), 'reads from multiple nodes').to.have.length(1)

  resp.success('All tests passed')
}
