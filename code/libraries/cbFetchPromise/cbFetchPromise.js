function cbFetchPromise(opts) {
    var deferred = Q.defer();

    var col = ClearBlade.Collection({ collectionName: opts.collectionName })
    var query = opts.query || ClearBlade.Query()
    col.fetch(query, function (err, res) {
        if(err) {
            deferred.reject(res);
        } else {
            deferred.resolve(res);
        }
    })

    return deferred.promise;
}