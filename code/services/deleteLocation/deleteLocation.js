function deleteLocation(req, resp) {
  ClearBlade.init({request: req});

  if (req.params.location_id) {
    req.params.location_ids = [req.params.location_id];
  }

  var col = ClearBlade.Collection({collectionName: LOCATIONS_COLLECTION_NAME});
  
  Q.all(req.params.location_ids.map(function(id) {
    var query = ClearBlade.Query();
    query.equalTo('item_id', id);
    col.remove(query, function() {
      log('successfully deleted location: ' + id)
    });
  })).then(function() {
    resp.success();
  }, function() {
    resp.error();
  })
}
