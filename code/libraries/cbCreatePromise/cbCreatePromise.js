function cbCreatePromise(opts) {
    var deferred = Q.defer();
    if(!opts.item) {
        log('ERROR trying to create without an item ' + opts)
    }
    var col = ClearBlade.Collection({ collectionName: opts.collectionName })
    col.create(opts.item, function (err, res) {
        
        if (err) {
            deferred.reject(res);
        } else {
            if (opts.cache) {
                opts.item.item_id = res[0].item_id
                opts.cache[res[0].item_id] = opts.item
            }
            deferred.resolve(res);
        }
    })

    return deferred.promise;
}