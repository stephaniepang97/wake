/*
 * This model uses the Node.js MongoDB Driver.
 */
var mongoClient = require('mongodb').MongoClient;
var connection_string = 'mongodb://localhost:27017/wake';

/*
 * If the MLAB_WAKE_PASSWD env variable exists, then use it in an mLab
 * connection string instead of the locally hosted mongoDB one.
 *
 * When I deploy, I set the environment variable by adding -e, as in
 * now -e MLAB_WAKE_PASSWD=@mlab_wake_passwd
 */
if(process.env.MLAB_WAKE_PASSWD){
  connection_string = "mongodb://stephanie:"
                      + process.env.MLAB_WAKE_PASSWD
                      + "@ds113566.mlab.com:13566/wake"
}

// Global variable of the connected database
var mongoDB; 

// Use connect method to connect to the MongoDB server
mongoClient.connect(connection_string, function(err, db) {
  if (err) doError(err);
  console.log("Connected to MongoDB server at: "+connection_string);
  mongoDB = db; // Make reference to db globally available.
  exports.mongoDB = mongoDB;
});

/********** CRUD Create -> Mongo insert ***************************************
 * @param {string} collection - The collection within the database
 * @param {object} data - The object to insert as a MongoDB document
 * @param {function} callback - Function to call upon insert completion
 */
exports.create = function(collection, data, callback) {
  // Do an asynchronous insert into the given collection
  mongoDB.collection(collection).insertOne(
    data,                     
    function(err, status) {  
      if (err) doError(err);
      // use the callback function supplied by the controller to pass
      // back true if successful else false
      var success = (status.result.n == 1 ? true : false);
      callback(success);
    });
}

/********** CRUD Retrieve -> Mongo find ***************************************
 * @param {string} collection - The collection within the database
 * @param {object} query - The query object to search with
 * @param {function} callback - Function to call upon completion
 */
exports.retrieve = function(collection, query, callback) {
  /*
   * The find sets up the cursor which you can iterate over and each
   * iteration does the actual retrieve. toArray asynchronously retrieves the
   * whole result set and returns an array.
   */
  mongoDB.collection(collection).find(query).toArray(function(err, docs) {
    if (err) doError(err);
    // docs are MongoDB documents, returned as an array of JavaScript objects
    // Use the callback provided by the controller to send back the docs.
    callback(docs);
  });
}

/********** CRUD Update -> Mongo updateMany ***********************************
 * @param {string} collection - The collection within the database
 * @param {object} filter - The MongoDB filter
 * @param {object} update - The update operation to perform
 * @param {function} callback - Function to call upon completion
 */
exports.update = function(collection, filter, update, callback) {
  mongoDB
    .collection(collection)     // The collection to update
    .updateMany(                // Use updateOne to only update 1 document
      filter,                   // Filter selects which documents to update
      update,                   // The update operation
      {upsert:true},            // If document not found, insert one with this update
                                // Set upsert false (default) to not do insert
      function(err, status) {   // Callback upon error or success
        if (err) doError(err);
        callback('Modified '+ status.modifiedCount 
                 +' and added '+ status.upsertedCount+" documents");
        });
}

/********** CRUD Delete -> Mongo deleteOne **********************
 * @param {string} collection - The collection within the database
 * @param {object} filter - The MongoDB filter
 * @param {function} callback - Function to call upon completion
 */
exports.delete = function(collection, filter, callback) {
	mongoDB.collection(collection).deleteMany(
		filter,
		function(err, status){
			if (err) doError(err);
			var success = ('Deleted ' +status.deletedCount +' documents');
			callback(success);
		});
}

// handle errors
var doError = function(e) {
  console.error("ERROR: " + e);
  throw new Error(e);
}
