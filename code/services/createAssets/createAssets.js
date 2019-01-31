function createAssets(req, resp) {
  ClearBlade.init({ request: req });

  var col = ClearBlade.Collection({collectionName: ASSETS_COLLECTION_NAME});

  if (req.params.asset) {
    req.params.assets = [req.params.asset];
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
      if (response.payload.length === req.params.assets.length) {
        resp.success(response);
      }
    }
  };

  req.params.assets.forEach(function (item) {
    var checkRes = checkRequiredFields(item, ASSETS_REQUIRED_FIELDS);
    if (checkRes) {
      response.err = true;
      response.message = checkRes;
      resp.success(response);
    }
    col.create(item, callback);
  });
}
