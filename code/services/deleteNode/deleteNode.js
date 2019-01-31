function deleteNode(req, resp) {
  ClearBlade.init({request: req});

  var response = {
    err: false,
    message: "",
    payload: []
  };

  var query = ClearBlade.Query();
  query.equalTo("item_id", req.params.node_id);
  log(req.params)

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      response.payload = data;
    }
    resp.success(response);
  }

  var col = ClearBlade.Collection({collectionName: NODES_COLLECTION_NAME});
  col.remove(query, callback);
}
