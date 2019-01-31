function deleteGateway(req, resp) {
  ClearBlade.init({request: req});


  if (req.params.gateway_id) {
    req.params.gateway_ids = [req.params.gateway_id];
  }

  var col = ClearBlade.Collection({collectionName: GATEWAYS_COLLECTION_NAME});
  
  Q.all(req.params.gateway_ids.map(function(id) {
    var query = ClearBlade.Query();
    query.equalTo('item_id', id);
    col.remove(query, function() {
      log('successfully deleted asset: ' + id)
    });
  })).then(function() {
    resp.success();
  }, function() {
    resp.error();
  })
}
