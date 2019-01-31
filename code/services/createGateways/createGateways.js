function createGateways(req, resp) {
  ClearBlade.init({ request: req });

  var col = ClearBlade.Collection({collectionName: GATEWAYS_COLLECTION_NAME});

  if (req.params.gateway) {
    req.params.gateways = [req.params.gateway];
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
      if (response.payload.length === req.params.gateways.length) {
        resp.success(response);
      }
    }
  };

  req.params.gateways.forEach(function (item) {
    var checkRes = checkRequiredFields(item, GATEWAYS_REQUIRED_FIELDS);
    if (checkRes) {
      response.err = true;
      response.message = checkRes;
      resp.success(response);
    }
    col.create(item, callback);
  });
}
