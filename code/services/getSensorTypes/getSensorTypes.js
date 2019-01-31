function getSensorTypes(req, resp) {
  var testParams = {
    sensor_type_id:"",  //optional   
  };
  req.params = testParams;
  
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

  var sendResponse = function() {
    resp.success(response)
  }

  var callback = function (err, data) {
    if (err) {	
      response.err= true;
      response.message = data;
    } else {
      response.payload = data;
    }
    sendResponse();
  };
  var col = ClearBlade.Collection({collectionName:"SensorTypes"});
  var query = ClearBlade.Query();
  if (typeof req.params.sensor_type_id !="undefined" && req.params.sensor_type_id!="" ){
    query.equalTo("item_id", req.params.sensor_type_id);
  }
  
  query.setPage(req.params.pageSize, req.params.pageNum);
  col.fetch(query, callback);
}
