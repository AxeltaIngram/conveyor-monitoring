function getAlerts(req, resp) {
  var testParams = {
    alert_id:"",  //optional
    type_id:"",  //optional
    configuration_id:"",  //optional
    customer_id:"", 
    pageNum:0,          //optional
    pageSize:0       //optional
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
  var col = ClearBlade.Collection({collectionName:ALERTS_COLLECTION_NAME});
  var query = ClearBlade.Query();
  if (typeof req.params.alert_id !="undefined" && req.params.alert_id!="" ){
    query.equalTo("item_id", req.params.alert_id);
  }
  if (typeof req.params.type_id !="undefined" && req.params.type_id!="" ){
    query.equalTo("type_id", req.params.type_id);
  }
  if (typeof req.params.configuration_id !="undefined" && req.params.configuration_id!="" ){
    query.equalTo("configuration_id", req.params.configuration_id);
  }
  if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
    query.equalTo("customer_id", req.params.customer_id);
  }
  query.equalTo("is_active", true);
  log((new Date()).toISOString())

  // would like to use this but not sure how to get greater than OR null, while keeping other queries so done in js
  // query.lessThan("snoozed_date", (new Date()).toISOString())
  query.setPage(req.params.pageSize, req.params.pageNum);
  col.fetch(query, callback);
}
