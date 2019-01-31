function updateEmployee(req, resp) {
  ClearBlade.init({ request: req });
  log(req.params)

  var response = {
    err: false,
    message: "",
    payload: {}
  }

  var sendResponse = function () {
    resp.success(response)
  }

  var user = ClearBlade.User();
  var query = ClearBlade.Query();
  query.equalTo("email", req.params.email);
  user.setUsers(query, req.params.employee, function (err, data) {
    response.payload = data;
    sendResponse();
  });
}
