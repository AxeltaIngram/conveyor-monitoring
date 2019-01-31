function getNodeTypes(req, resp) {

  if (typeof req.params.pageNum == "undefined") {
    req.params.pageNum = 0;
  }
  if (typeof req.params.pageSize == "undefined") {
    req.params.pageSize = 0;
  }
  ClearBlade.init({ request: req });
  var response = {
    err: false,
    message: "",
    payload: {}
  }

  var sendResponse = function () {
    resp.success(response)
  }

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
    } else {
      response.payload = data;
    }
    sendResponse();
  };
  var col = ClearBlade.Collection({ collectionName: NODE_TYPES_COLLECTION_NAME });
  var query = ClearBlade.Query();
  query.setPage(req.params.pageSize, req.params.pageNum);
  col.fetch(query, callback);
}
