var ClientOAuth2 = require('client-oauth2');
var request = require('request');
 
var montevideoAuth = new ClientOAuth2({
  clientId: '',
  clientSecret: '',
  accessTokenUri: '',
});

montevideoAuth.credentials.getToken().then(function (user) {
    request({
      url: '',
      auth: {
        'bearer': user.accessToken
      }
    }, function(err, res) {
      console.log(res.body);
    });
});
