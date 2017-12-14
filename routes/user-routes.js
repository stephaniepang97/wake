var users = require("../models/users.js")

/*
 * Export an init method that will define a set of routes
 * handled by this file.
 * @param app - The Express app
 */
exports.init = function(app) {
  var passport = app.get('passport');

  // pages you can only view if you're logged in
  app.get('/home', checkAuthentication, home);
  app.get('/alarms', checkAuthentication, alarms);
  app.get('/friends', checkAuthentication, friends);
  app.get("/new-alarm", checkAuthentication,
    function(req, res){ res.render('new-alarm', {user: req.user}); } );

  // get all the usernames
  app.get('/usernames', usernames);

  // login route
  app.post('/login',
        passport.authenticate('local', {
                              failureRedirect: '/',
                              successRedirect: '/login-spotify'}));
  // The Logout route
  app.get('/logout', doLogout);

  // CRUD operations for user model
  app.get("/user", retrieveUser);
  app.post("/user", updateUser);
  app.put("/user", createUser);
  app.delete("/user", deleteUser);
}

// pages you can only view if you're logged in
home = function(req, res) {
  res.render('home', {home: "active", alarms: "", friends: "", user: req.user});
};
alarms = function(req, res) { 
  res.render('alarms', {home: "", alarms: "active", friends: "", user: req.user});
};
friends = function(req, res) {
  res.render('friends', {home: "", alarms: "", friends: "active", user: req.user});
};
usernames = function(req, res){
  users.usernames(function(err, result){
    if (err){
      res.render("error", {message: err});
    } else{
      res.send(result);
    }
  });
}

/*
 * Check if the user has authenticated
 * @param req, res - as always...
 * @param {function} next - The next middleware to call.
 */
function checkAuthentication(req, res, next){
    // Passport will set req.isAuthenticated
    if(req.isAuthenticated()){
      next();
    }else{
      // The user is not logged in. Redirect to the login page.
      res.redirect("/");
    }
}


/* 
 * Log out the user
 */
function doLogout(req, res){
  // Passport puts a logout method on req to use.
  req.logout();
  // Redirect the user to the welcome page which does not require
  // being authenticated.
  res.redirect('/');
};

/********** CRUD Create *******************************************************
 * Take the object defined in the request body and do the Create
 * operation in users. 
 */ 
createUser = function(req, res){
  /*
   * First check if req.body has something to create.
   * Object.keys(req.body).length is a quick way to count the number of
   * properties in the req.body object.
   */
  if (Object.keys(req.body).length == 0) {
    res.render('error', {message: "No create message body found"});
    return;
  }

  users.create( req.body,
                function(result) {
                  // result equal to true means create was successful
                  var success = (result ? "Welcome!" : "Error in creating user");
                  res.send(success);
                });
}

/********** CRUD Retrieve (or Read) *******************************************
 * Take the object defined in the query string and do the Retrieve
 * operation in users.  
 */ 

retrieveUser = function(req, res){
  users.retrieve(
    req.query,
		function(modelData) {
		  if (modelData.length) {
        res.status(200).send(modelData);
      } else {
        var message = "No documents with "+JSON.stringify(req.query)+ 
                      " in collection "+"user"+" found.";
        res.status(500).render('error', {message: message});
      }
		});
}

/********** CRUD Update *******************************************************
 * Take the MongoDB update object defined in the request body and do the
 * update.  (I understand this is bad form for it assumes that the client
 * has knowledge of the structure of the database behind the model.  I did
 * this to keep the example very general for any collection of any documents.
 * You should not do this in your project for you know exactly what collection
 * you are using and the content of the documents you are storing to them.)
 */ 
updateUser = function(req, res){
  // if there is no filter to select documents to update, select all documents
  var filter = req.body.find ? JSON.parse(req.body.find) : {};
  // if there no update operation defined, render an error page.
  if (!req.body.update) {
    res.render('/error', {message: "No update operation defined"});
    return;
  }
  var update = JSON.parse(req.body.update);
  /*
   * Call the model Update with:
   *  - The collection to update
   *  - The filter to select what documents to update
   *  - The update operation
   *    E.g. the request body string:
   *      find={"name":"pear"}&update={"$set":{"leaves":"green"}}
   *      becomes filter={"name":"pear"}
   *      and update={"$set":{"leaves":"green"}}
   *  - As discussed above, an anonymous callback function to be called by the
   *    model once the update has been successful.
   */
  users.update(filter, update,
	  function(status) {
      console.log("User update status: " + status);
      res.status(200).end();
	  });
}

/********** CRUD Delete *******************************************************
 * Take the object defined in the query string and do the Delete
 * operation in users.  
 */

deleteUser = function(req, res){
  users.delete(
    req.query,
		function(result) {
      res.send(result);
    });
}
