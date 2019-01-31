function getLocations(req, resp) {
  
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  ClearBlade.init({request:req});

  var response = {
    err:false,
    message:"",
    payload:{}
  }

  var callback = function (err, data) {
    if (err) {	
      response.err= true;
      response.message = data;
    } else {
      response.payload = data;
    }
    resp.success(response);
  };

  var col = ClearBlade.Collection({collectionName: LOCATIONS_COLLECTION_NAME});

  var query = ClearBlade.Query();
  if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
    query.equalTo("item_id", req.params.location_id);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);

  col.fetch(query, callback);
}
