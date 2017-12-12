var mongoModel = require("../models/mongoModel.js")

exports.create = function(data, callback){
	mongoModel.create('alarm', data, callback);
}
exports.retrieve = function(query, callback){
	mongoModel.retrieve('alarm', query, callback);
}
exports.update = function(filter, update, callback){
	mongoModel.update('alarm', filter, update, callback);
}
exports.delete = function(filter, callback){
	mongoModel.delete('alarm', filter, callback);
}