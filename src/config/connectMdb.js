
var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://diamond:<password>@ac-f8qfnzx-shard-00-00.int4ver.mongodb.net:27017,ac-f8qfnzx-shard-00-01.int4ver.mongodb.net:27017,ac-f8qfnzx-shard-00-02.int4ver.mongodb.net:27017/?ssl=true&replicaSet=atlas-duwswz-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0&ssl=true";
MongoClient.connect(uri, function (err, client) {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
