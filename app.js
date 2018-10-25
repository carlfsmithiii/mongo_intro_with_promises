const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'myproject2';

MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    assert.equal(null, err);
    console.log('Connected successfully to server');

    const db = client.db(dbName);

    // insertDocuments(db).then(findDocuments(db)).then(client.close());
//    insertDocuments(db).then(updateDocument(db)).then(removeDocument(db)).then(client.close());
    insertDocuments(db).then(indexCollection(db)).then(client.close());
});

const insertDocuments = function(db) {
    const collection = db.collection('documents');
    return collection.insertMany([
        {a: 1}, {a: 2}, {a: 3}
    ]).then((result) => {
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("inserted 3 documents into the collection"); 
        return result;
    });
}

const findDocuments = function(db) {
    const collection = db.collection('documents');
    return collection.find({'a': 3}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        return docs;
    });
}

const updateDocument = function(db) {
    const collection = db.collection('documents');
    collection.updateOne(
        {a: 2},
        {$set: {b: 1}},
        function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log('Updated the document with the field a equal to 2');
            return result;
        }
    );
};

const removeDocument = function(db, callback) {
    const collection = db.collection('documents');
    collection.deleteOne(
        {a: 3},
        function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Removed the document with the field a equal to 3");
            return result;
        }
    );
}

const indexCollection = function(db) {
    db.collection('documents').createIndex(
        {"a": 1},
        null,
        function(err, results) {
            console.log(results);
            return;
        }
    );
}
