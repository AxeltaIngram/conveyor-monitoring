function createNodes(req, resp) {
  ClearBlade.init({ request: req });

  var col = ClearBlade.Collection({collectionName: NODES_COLLECTION_NAME});

  if (req.params.node) {
    req.params.nodes = [req.params.node];
  }

  var response = {
    err: false,
    message: "",
    payload: []
  };

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
      resp.success(response);
    } else {
      response.payload.push(data[0].item_id);
      if (response.payload.length === req.params.nodes.length) {
        resp.success(response);
      }
    }
  };

  req.params.nodes.forEach(function (item) {
    var checkRes = checkRequiredFields(item, NODES_REQUIRED_FIELDS);
    if (checkRes) {
      response.err = true;
      response.message = checkRes;
      resp.success(response);
    }
    col.create(item, callback);
  });
}
