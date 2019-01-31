function deleteAsset(req, resp) {
  ClearBlade.init({request: req});

  if (req.params.asset_id) {
    req.params.asset_ids = [req.params.asset_id];
  }

  var col = ClearBlade.Collection({collectionName: ASSETS_COLLECTION_NAME});
  
  Q.all(req.params.asset_ids.map(function(id) {
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
