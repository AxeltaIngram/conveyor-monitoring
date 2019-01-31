function getHistoryForAsset(req, resp) {
//   var testParams = {
//     assetId: "534a1858-74a3-4962-af0c-0e2126c93969",
//     startTime: "2018-12-03T19:13:58.971Z",
//     endTime: "2018-12-03T19:37:58.971Z"
//   };
//   req.params = testParams;

  ClearBlade.init({ request: req });
  var response = {
    err: false,
    message: "",
    payload: {}
  };

  var sensorCols = ["temp1", "temp2", "temp3", "temp4", "ai1", "ai2"];
  var assetIdCols = sensorCols.map(function(col) {
    return col + "_asset_id";
  });

  fetchNodesForAsset(req.params.assetId);

  function sendResponse() {
    resp.success(response);
  }

  function fetchNodesForAsset(assetId) {
    var query = ClearBlade.Query({ collectionName: "Nodes" });
    query.equalTo(assetIdCols[0], assetId);

    for (var i = 1, len = assetIdCols.length; i < len; i++) {
      var orQuery = ClearBlade.Query();
      orQuery.equalTo(assetIdCols[i], assetId);
      query.or(orQuery);
    }

    query.fetch(function(err, data) {
      if (err) {
        resp.error(data);
      } else {
        if (data.DATA.length > 0) {
          fetchHistory(data.DATA);
        } else {
          resp.err = false;
          resp.message = "No matching nodes for asset ID";
          resp.payload = {};
          sendResponse();
        }
      }
    });
  }

  function fetchHistory(nodes) {
    log(nodes);
    var rootQuery;
    for (var i = 0; i < nodes.length; i++) {
      var query = ClearBlade.Query();
      query.ascending("t");
      query.greaterThan("t", req.params.startTime);
      query.lessThan("t", req.params.endTime);
      query.equalTo("mac", nodes[i].node_mac_address);

      query.setPage(0, 0);
      if (i == 0) {
        rootQuery = query;
      } else {
        rootQuery = rootQuery.or(query);
      }
    }
    var col = ClearBlade.Collection({ collectionName: "NodeData" });
    col.fetch(rootQuery, callback);

    function callback(err, data) {
      if (err) {
        response.err = true;
        response.message = data;
        sendResponse();
      } else {
        // a map of node mac addresses to any sensors that aren't relevant to the asset
        var nodeToSensorIdMap = createNodeToSensorMap(
          nodes,
          req.params.assetId
        );

        // delete any sensor values that aren't relevant for this asset
        response.payload = data.DATA.map(function(row) {
          for (var key in nodeToSensorIdMap) {
            if (row.mac === key) {
              nodeToSensorIdMap[key].forEach(function(sensorId) {
                row[createId(key, sensorId)] = row[sensorId];
              });
              break;
            }
          }
          return row;
        });
        response.payload = data;
        response.payload.nodes = nodes;
        response.payload.ids = createSensorIds(nodeToSensorIdMap);
        sendResponse();
      }
    }
  }

  function createId(mac, sensorId) {
    return mac + "-" + sensorId;
  }

  function createSensorIds(nodeToSensorIdMap) {
    var rtn = [];
    for (var key in nodeToSensorIdMap) {
      for (var i = 0, len = nodeToSensorIdMap[key].length; i < len; i++) {
        rtn.push(createId(key, nodeToSensorIdMap[key][i]));
      }
    }
    return rtn;
  }

  function createNodeToSensorMap(nodes, assetId) {
    var rtn = {};
    nodes.forEach(function(nod) {
      rtn[nod.node_mac_address] = [];
      assetIdCols.forEach(function(idCol, idx) {
        if (nod[idCol] === assetId) {
          rtn[nod.node_mac_address].push(sensorCols[idx]);
        }
      });
    });
    return rtn;
  }
}
