function deleteLocationType(req, resp) {
  var testParams = {
    location_type_id: "dca2be4e-cbb2-43dc-b106-caec7f306f33"
  };
  // req.params = testParams;
  ClearBlade.init({ request: req });
  
  if (req.params.location_type_id) {
    req.params.location_type_ids = [req.params.location_type_id];
  }

  var col = ClearBlade.Collection({collectionName: LOCATION_TYPES_COLLECTION_NAME});
  
  Q.all(req.params.location_type_ids.map(function(id) {
    var query = ClearBlade.Query();
    query.equalTo('item_id', id);
    col.remove(query, function() {
      log('successfully deleted location type: ' + id)
    });
  })).then(function() {
    resp.success();
  }, function() {
    resp.error();
  })
}
