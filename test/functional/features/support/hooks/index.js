const AuthClient = require('../api/auth');
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));

const users = [
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


const useapi = argv.useapi;

module.exports = {
  onPrepare: () => {
    if (useapi) {
      const authClient = new AuthClient({
        baseUrl: 'https://ovumforecaster.eu.auth0.com',
        clientId: 'Vgr41tJnuOHOFVBTZweJ21OsKmz9E6AY',
        clientSecret: 'Mk-lXlScVxCgBVx7-ZZraXgneJX0nsSD3krvuKbz8GLH6EhdU7GBF9IZs58JzH9p',
        audience: 'https://api.forecaster.dev.tmt.informa-labs.com/',
        realm: 'Ovum-Forecaster-SAMS-DEV',
        responseType: 'token id_token'
      });

      authClient.createTestUsers().then(() => {
        process.env._sessions = JSON.stringify(authClient.testUsers);
      });
    }
  },
  beforeSession: () => {
    if (useapi) {
      global._sessions = JSON.parse(process.env._sessions);
    }
  }
};
