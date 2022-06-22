const request = require('request-promise-native');

const usernames = [
  'bdd_user_1@informa.com',
  'bdd_user_2@informa.com',
  'bdd_user_3@informa.com',
  'bdd_user_4@informa.com',
  'bdd_user_5@informa.com',
  'bdd_user_6@informa.com',
  'bdd_user_7@informa.com',
  'bdd_user_8@informa.com',
  'bdd_user_9@informa.com',
  'bdd_user_10@informa.com'
];
const password = '06T$ster';

class AuthClient {

  constructor({
    baseUrl,
    clientId,
    clientSecret,
    audience,
    realm
  }) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.audience = audience;
    this.realm = realm;
  }

  getAccessToken(username, password) {
    return request.post({
      url: `${this.baseUrl}/oauth/token`,
      json: true,
      body: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
        realm: this.realm,
        scope: 'openid',
        grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
        username,
        password
      }
    }).then(body => body);
  }

  createTestUsers() {
    this.testUsers = [];
    this.promiseArray = [];
    usernames.forEach(username => {
      this.promiseArray.push(this.getAccessToken(username, password).then(auth => {
        this.testUsers.push(auth);
        return auth;
      }));
    });
    return Promise.all(this.promiseArray);
  }
}

module.exports = AuthClient;
