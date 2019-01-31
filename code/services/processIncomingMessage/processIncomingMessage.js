function processIncomingMessage(req, resp) {
  ClearBlade.init({request: req});
  
  var msg = JSON.parse(req.params.body);

  var nodeCol = ClearBlade.Collection({collectionName: NODES_COLLECTION_NAME});
  var nodeDataCol = ClearBlade.Collection({collectionName: NODE_DATA_COLLECTION_NAME});

  var insertData = function () {
    nodeDataCol.create(msg, createCallback);
  }

  var fetchCallback = function (err, data) {
    if (err) {
      resp.error("failed to fetch nodes: " + JSON.stringify(data));
    } else {
      if (data.TOTAL === 0) {
        insertData();
      } else if (data.TOTAL === 1) {
        var updateObj = {
          vbatt: msg.vbatt,
          tempint: msg.tempint,
          temp4: msg.temp4,
          temp3: msg.temp3,
          temp2: msg.temp2,
          temp1: msg.temp1,
          ai2: msg.ai2,
          ai1: msg.ai1,
          last_reading: msg.t
        };
        nodeCol.update(query, updateObj, updateCallback);
      } else {
        resp.error("multiple nodes registered with same mac address");
      }
    }
  }

  var updateCallback = function (err, data) {
    if (err) {
      resp.error("failed to update node: " + JSON.stringify(data));
    } else {
      log('updateCallback' + JSON.stringify(data))
      insertData();
    }
  }

  var createCallback = function (err, data) {
    if (err) {
      resp.error("failed to create node data: " + JSON.stringify(data));
    } else {
      resp.success('success');
    }
  }

  var query = ClearBlade.Query();
  query.equalTo("node_mac_address", msg.mac);

  nodeCol.fetch(query, fetchCallback);
}
