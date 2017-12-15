
var request = require('request');
var querystring = require('querystring');

// required for authorization for Spotify API 
var client_id = "1e379aa39d2d431f8faceb7ecc5bcdbf";
var client_secret = "f7fb3e20dab84fe4bd1b2845a4869e4d";
// var redirect_uri = 'https://wake-klbqjyzvfv.now.sh/tokens';

exports.init = function(app) {
  app.get("/login-spotify", loginSpotify);
  app.get("/tokens", requestTokens);
  app.get("/refresh-token", refreshToken);
}

/********** Credit **************/
// adapted from Spotify API tutorial at:
// https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js

// authorize app with Spotify API
loginSpotify = function(req, res) {
  var redirect_uri = req.protocol + '://' + req.get('host') + "/tokens";
  var scope = 'user-read-private user-read-email streaming user-modify-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      show_dialog: "true" //user will not be automatically redirected
    }));
}


// gets access and refresh tokens 
requestTokens = function(req, res){
  var code = req.query.code || null;
  var redirect_uri = req.protocol + '://' + req.get('host') + "/tokens";

  // get access and refresh token using client id and secret 
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
          refresh_token = body.refresh_token;

      // use access token to get user data from Spotify
      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      // use the access token to access the Spotify Web API and update profile
      request.get(options, function(error, response, body) {
        var user_data = Object.assign({"access_token":access_token, "refresh_token":refresh_token}, body);

        // add access and refresh tokens and spotify user data to mongo db
        var updateUserOptions = {
          url: req.protocol + '://' + req.get('host') + "/user",
          form: {
            find: `{"username": "${req.user.username}"}`,
            update: `{ "$set": ${JSON.stringify(user_data)} }`
          }                 
        }
        request.post(updateUserOptions, function(postError, postResponse, postBody){
          if (postError){
            console.log("ERROR: "+postError);
            res.render("error", {"message": postError});
            return;
          } else {
            // redirect to home after completing log in
            res.redirect('/home');
          }
        });

        

      });

    } else {
      res.render('/error', { "message": 'invalid_token'});
    }
  });

}

// use refresh token to generate new access_token
refreshToken = function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  // makes the request 
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
}




