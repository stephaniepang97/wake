
var request = require('request');
var querystring = require('querystring');

// required for authorization for Spotify API 
var client_id = "1e379aa39d2d431f8faceb7ecc5bcdbf";
var client_secret = "f7fb3e20dab84fe4bd1b2845a4869e4d";
var redirect_uri = 'http://localhost:50000/tokens';

exports.init = function(app) {
  app.get("/login-spotify", loginSpotify);
  app.get("/tokens", requestTokens);
  app.get("/refresh-token", refreshToken);
}

/********** Credit **************/
// adapted from Spotify API tutorial at:
// https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js


loginSpotify = function(req, res) {
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      show_dialog: "true" //user will not be automatically redirected
    }));
}


requestTokens = function(req, res){
  var code = req.query.code || null;

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

      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };
      // use the access token to access the Spotify Web API
      request.get(options, function(error, response, body) {
        console.log(body);
      });

      // add access and refresh tokens to mongo db
      var updateUserOptions = {
        url: '/user',
        form: {
          find: {"username": "spang"},
          update: {
            "$set": {
              "access_token": access_token,
              "refresh_token": refresh_token
            }
          }
        }
      }
      request.post(updateUserOptions, function(error, response, body){
        console.log(body);
        console.log("UPDATE USER");
      });

      // we can also pass the token to the browser to make requests from there
      res.redirect('/#' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });


}


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

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
}




