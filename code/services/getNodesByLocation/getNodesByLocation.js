function getNodesByLocation(req, resp) {
  ClearBlade.init({ request: req });

  getGatewaysByLocation(req.params.location_id);

  function getGatewaysByLocation(locationId) {
    var query = ClearBlade.Query({ collectionName: "Gateways" });
    query.equalTo('location_id', locationId);
    query.fetch(function (err, data) {
      if (err) {
        resp.error(data);
      } else {
        if (data.DATA.length > 0) {
          var gatewayIds = data.DATA.map(function(g) {
            return g.item_id;
          })
          getNodesForGateways(gatewayIds);
        } else {
          resp.success({ DATA: [] });
        }
      }
    })
  }

  function getNodesForGateways(gatewayIds) {
    var query = ClearBlade.Query({collectionName: "Nodes"});
    query.equalTo("gateway_id", gatewayIds[0]);
    for (var i=1, len=gatewayIds.length; i < len; i++) {
      var orQuery = ClearBlade.Query();
      orQuery.equalTo("gateway_id", gatewayIds[i]);
      query.or(orQuery);
    }

    query.fetch(function(err, data) {
      if (err) {
        resp.error(data);
      } else {
        resp.success(data);
      }
    })
  }

}
