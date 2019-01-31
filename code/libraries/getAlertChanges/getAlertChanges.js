
function getAlertChanges(nodeMsg, alertConfigs, activeAlerts, nodes) {
    var results = []
    alertConfigs.forEach(function (alertConfig) {
        var alertBroken = checkAlertViolated(nodeMsg, alertConfig, nodes)
        var activeAlert = activeAlerts.filter(function (alert) {
            return alert.configuration_id === alertConfig.item_id
        })[0]
        log({alertBroken})
        if (!activeAlert && alertBroken) {
            var currentTimestamp = new Date(Date.now()).toISOString();
            results.push({
                newAlert: {
                    "is_active": true,
                    "sent_date": currentTimestamp,
                    "target_users": alertConfig.contacts,
                    "type_id": alertConfig.type_id,
                    "configuration_id": alertConfig.item_id,
                }
            })
        }
    })
    return results
}