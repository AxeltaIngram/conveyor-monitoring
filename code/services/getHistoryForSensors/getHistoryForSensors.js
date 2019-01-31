function getHistoryForSensors(req, resp) {
  //   var testParams = {
  //     sensor_ids: [
  //       { sensor: "temp1", mac: "00170D000030F09C" },
  //       { sensor: "temp2", mac: "00170D000030F09C" }
  //     ],
  //     startTime: "2018-12-03T19:13:58.971Z",
  //     endTime: "2018-12-03T19:37:58.971Z"
  //   };
  //   req.params = testParams;

  ClearBlade.init({ request: req });

  getNodes(req.params.sensor_ids);

  function getNodes(sensors) {
    var q = buildOrQuery(
      "node_mac_address",
      sensors.map(function(s) {
        return s.mac;
      })
    );
    var coll = ClearBlade.Collection({ collectionName: "Nodes" });
    coll.fetch(q, function(err, data) {
      if (err) {
        resp.error(data);
      } else {
        getNodeHistory(
          req.params.sensor_ids,
          req.params.startTime,
          req.params.endTime,
          data.DATA
        );
      }
    });
  }

  function getNodeHistory(sensors, startTime, endTime, nodes) {
    var q = buildHistoryQuery(sensors, startTime, endTime);
    var coll = ClearBlade.Collection({ collectionName: "NodeData" });
    coll.fetch(q, function(err, data) {
      if (err) {
        resp.error(data);
      } else {
        resp.success({
          data: formatHistory(data.DATA, sensors),
          ids: generateIds(sensors),
          nodes: nodes
        });
      }
    });
  }

  function generateIds(sensors) {
    return sensors.map(function(s) {
      return createLabel(s);
    });
  }

  function formatHistory(data, sensors) {
    try {
      for (var i = 0, dataLen = data.length; i < dataLen; i++) {
        for (var j = 0, sensorLen = sensors.length; j < sensorLen; j++) {
          if (data[i].mac === sensors[j].mac) {
            data[i][createLabel(sensors[j])] = data[i][sensors[j].sensor];
          }
        }
      }
      return data;
    } catch (e) {
      return data;
    }
  }

  function createLabel(sensor) {
    return sensor.mac + "=" + sensor.sensor;
  }

  function buildOrQuery(key, values) {
    var rootQuery;
    for (var i = 0, len = values.length; i < len; i++) {
      var query = ClearBlade.Query();
      query.equalTo(key, values[i]);

      if (i == 0) {
        rootQuery = query;
      } else {
        rootQuery = rootQuery.or(query);
      }
    }
    return rootQuery;
  }

  function buildHistoryQuery(sensorIds, startTime, endTime) {
    var rootQuery;
    for (var i = 0; i < sensorIds.length; i++) {
      var query = ClearBlade.Query();
      query.greaterThan("t", startTime);
      query.lessThan("t", endTime);
      query.equalTo("mac", sensorIds[i].mac);
      if (i == 0) {
        rootQuery = query;
      } else {
        rootQuery = rootQuery.or(query);
      }
    }
    query.ascending("t");
    query.setPage(0, 0);
    return rootQuery;
  }
}
