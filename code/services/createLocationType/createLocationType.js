function createLocationType(req, resp) {
  ClearBlade.init({ request: req });

  var response = {
    err: false,
    message: "",
    payload: []
  }

  var sendResponse = function () {
    resp.success(response)
  }

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
      sendResponse();
    } else {
      response.payload.push(data[0].item_id)
      if (response.payload.length === req.params.location_types.length) {
        sendResponse();
      }
    }
  };

  var col = ClearBlade.Collection({ collectionName: LOCATION_TYPES_COLLECTION_NAME });

  if (req.params.location_type) {
    req.params.location_types = [req.params.location_type]
  }

  req.params.location_types.forEach(function (item) {
    var checkRes = checkRequiredFields(item, LOCATION_TYPES_REQUIRED_FIELDS);
    if (checkRes) {
      response.err = true;
      response.message = checkRes;
      sendResponse();
    }
    col.create(item, callback);
  })
}
