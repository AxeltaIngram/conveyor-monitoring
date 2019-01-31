function processAndCreateAlerts(req, resp) {
  ClearBlade.init({ request: req });
  var nodeMsg = JSON.parse(req.params.body);
  var alertConfigs
  var activeAlerts

  var query = ClearBlade.Query().equalTo('node_mac_address', nodeMsg.mac).columns(['item_id'])
  cbFetchPromise({ collectionName: 'Nodes', query }).then(function (res) {
    var item_id = res.DATA[0].item_id
    nodeMsg.item_id = item_id

    var query = ClearBlade.Query().matches("rules", item_id);
    return Q.all([
      cbFetchPromise({ collectionName: 'AlertConfigurations', query }),
      cbFetchPromise({ collectionName: 'Alerts', query: ClearBlade.Query().equalTo("is_active", true) }),
    ])
  }).then(function (res) {
    alertConfigs = res[0].DATA
    activeAlerts = res[1].DATA

    // var idsToFind = { [nodeMsg.item_id]: true }
    // alertConfigs = alertConfigs.map(function (alertconfig) {
    //   var rules = JSON.parse(alertConfig.rules)
    //   alertConfig.rules = rules
    //   if (!idsToFind[rules.node_id]) {
    //     idsToFind[rules.node_id] = true
    //   }
    //   return alertConfig
    // })

    // var query = ClearBlade.Query();
    // Object.keys(idsToFind).forEach(function (id) {
    //   q = ClearBlade.Query().equalTo('item_id', id);
    //   query = query.or(q);
    // })
    return cbFetchPromise({ collectionName: "Nodes", query: ClearBlade.Query().columns(['item_id', 'temp4', 'temp3', 'temp2', 'temp1', 'ai2', 'ai1']) })
  }).then(function (res) {
    nodes = res.DATA
    getAlertChanges(nodeMsg, alertConfigs, activeAlerts, nodes).forEach(function (whatToDo) {
      if (whatToDo.newAlert) {
        log('CREATING alert')
        log(whatToDo.newAlert)
        cbCreatePromise({ collectionName: 'Alerts', item: whatToDo.newAlert })
      }
    })
  })

}
