var mongoModel = require("../models/mongoModel.js")

exports.create = function(data, callback){
	mongoModel.create('user', data, callback);
}
exports.retrieve = function(query, callback){
	mongoModel.retrieve('user', query, callback);
}
exports.update = function(filter, update, callback){
	mongoModel.update('user', filter, update, callback);
}
exports.delete = function(filter, callback){
	mongoModel.delete('user', filter, callback);
}

/* 
 * Find a user given their username
 * @param {string} username - username to be searched for in the database
 * @param {function} callback - the function to call upon completion
 */
exports.findByUsername = function(username, callback) {
  var foundUser = null;
  var err = null;

  // get user from database
  mongoModel.mongoDB 
  	.collection('user')
		.findOne({"username":username}, callback);
}

/* 
 * Find a user given their id
 * @param {number} id - id to be searched for in the database
 * @param {function} callback - the function to call upon completion
 */
exports.findById = function(id, callback) {
  var foundUser = null;
  var err = null;

  // get user from database
  mongoModel.mongoDB 
  	.collection('user')
		.findOne({"_id":id}, callback);
}
