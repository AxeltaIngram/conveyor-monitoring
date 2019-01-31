function createLocations(req, resp) {
  ClearBlade.init({ request: req });

  var col = ClearBlade.Collection({collectionName: LOCATIONS_COLLECTION_NAME});

  if (req.params.location) {
    req.params.locations = [req.params.location];
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
      if (response.payload.length === req.params.locations.length) {
        resp.success(response);
      }
    }
  };

  req.params.locations.forEach(function (item) {
    var checkRes = checkRequiredFields(item, LOCATIONS_REQUIRED_FIELDS);
    if (checkRes) {
      response.err = true;
      response.message = checkRes;
      resp.success(response);
    }
    col.create(item, callback);
  });
}