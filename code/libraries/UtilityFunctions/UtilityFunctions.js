var checkRequiredFields = function (obj, fields) {
    var returnValue = null;
    fields.forEach(function (keyName) {
        if (!obj.hasOwnProperty(keyName)) {
            log()
            returnValue = keyName + " cannot be blank";
        }
    });
    return returnValue;
};