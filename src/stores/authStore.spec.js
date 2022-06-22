import {AuthStore, EVENTS as AUTH_EVENTS} from './authStore';
import {FakeConfig} from '../../test/unit/helpers/fake-config';
import {EventAggregator} from 'aurelia-event-aggregator';
import {GenericService} from '../services/genericService';
import {BindingEngine} from 'aurelia-framework';

describe('AuthStore', () => {
  let authStore, currentTime, fakeConfig, spyWebAuthLogout, fakeJwtDecode, fakeRouter, eventAggregator, fakeAnalyticsService, fakeLoggerService;
  const logoutURL =`${window.location.origin}`;


  const fakeDecode = (token) => {
    const userMetadata = {
      company: 'company a',
      samsAccountId: 12345,
      exportEnabled: false
    };

    if (token === '1') {
      return {
        sub: 'abc123',
        nickname: 'nickname 1',
        name: 'email1@example.com',
        'family_name': 'surname',
        'https://ovumforecaster.com/': userMetadata
      };
    }
  };


  beforeEach(() => {
    fakeConfig = new FakeConfig().set('authDomain', 'http://localhost/')
      .set('authClientId', 123)
      .set('authCallback', `${window.location.origin}/auth`)
      .set('authLogoutUrl', logoutURL);

    fakeJwtDecode = x => x;
    fakeRouter = { };
    eventAggregator = new EventAggregator();
    const webAuth = {
      logout: () => {
      }
    };
    spyWebAuthLogout = spyOn(webAuth, 'logout');
    fakeAnalyticsService = {
      pushEvent: (event, data, callback) => {
        if (typeof data === 'function') {
          data();
        } else if (callback) {
          callback();
        }
      },
      pushException: (description, fatal, callback) => {
        if (typeof fatal === 'function') {
          fatal();
        } else {
          callback();
        }
      }
    };

    fakeLoggerService = {
      createLogger() {
        return {
          info: () => {}
        };
      }
    };

    authStore = new AuthStore(() => {
      return currentTime;
    }, fakeConfig, webAuth, fakeJwtDecode, fakeAnalyticsService, fakeLoggerService, fakeRouter, new BindingEngine(), eventAggregator, GenericService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('is not authenticated if no expires_at', () => {
    expect(authStore.data.isValid).toEqual(false);
  });

  it('is not authenticated if expires_at is equal to less than current time', () => {
    currentTime = new Date().getTime();
    localStorage.setItem('expires_at', currentTime - 1);
    expect(authStore.data.isValid).toEqual(false);
  });

  it('is not authenticated if expires_at is equal to than current time', () => {
    currentTime = new Date().getTime();
    localStorage.setItem('expires_at', currentTime);
    expect(authStore.data.isValid).toEqual(false);
  });

  it('is authenticated if expires_at is greater than current time', () => {
    currentTime = new Date().getTime();
    localStorage.setItem('expires_at', currentTime + 1);
    expect(authStore.session.isValid()).toEqual(true);
  });


  describe('Creating session', () => {
    [30, 60].forEach(seconds => {
      it(`sets session expiry in ${seconds} seconds`, () => {
        currentTime = 4;

        authStore.setSession({expiresIn: seconds});

        expect(localStorage.getItem('expires_at')).toEqual((seconds * 1000 + currentTime) + '');
      });
    });

    ['1', '2'].forEach(idToken => {
      it(`sets idToken ${idToken}`, () => {
        authStore.setSession({expiresIn: 30, idToken: idToken});

        expect(localStorage.getItem('id_token')).toEqual(idToken);
        expect(authStore.session.getUser()).toBeDefined();
      });
    });

    it('should get user name, company and exportEnabled from the user details in the session', () => {
      currentTime = new Date().getTime();

      localStorage.setItem('id_token', '1');
      localStorage.setItem('expires_at', currentTime + 30);
      authStore = new AuthStore(() => currentTime, fakeConfig, {}, fakeDecode, fakeAnalyticsService, fakeLoggerService, fakeRouter, new BindingEngine(), eventAggregator, GenericService);


      expect(authStore.session.getUser()).toEqual({
        id: 'abc123',
        samsAccountId: 12345,
        name: 'nickname 1',
        email: 'email1@example.com',
        company: 'company a',
        exportEnabled: false,
        products: []
      });
    });

    ['abc', 'def'].forEach(access_token => {
      it(`sets access_token ${access_token}`, () => {
        authStore.setSession({expiresIn: 0, accessToken: access_token });

        expect(localStorage.getItem('access_token')).toEqual(access_token);
      });
    });

    it('decodes id token and identifies user in fullstory', (done) => {
      global.FS = {
        identify(id, context) {
          // Ignore if vars are undefined, gets called from elsewhere as well
          if (!id && !context) {
            return done();
          }

          expect(id).toEqual('email1@example.com');
          expect(context.displayName).toEqual('email1@example.com');

          done();
        },
        setUserVars() {}
      };

      authStore = new AuthStore(() => currentTime, fakeConfig, {}, fakeDecode, fakeAnalyticsService, fakeLoggerService, fakeRouter, new BindingEngine(), eventAggregator, GenericService);
      authStore.setSession({expiresIn: 0, idToken: '1'});
    });

    it('decodes id token and sets user in fullstory', (done) => {
      global.FS = {
        identify() {},
        setUserVars(vars) {
          // Ignore if vars are undefined, gets called from elsewhere as well
          if (!vars) {
            return done();
          }

          expect(vars.name_str).toEqual('nickname 1');
          expect(vars.company_str).toEqual('company a');

          done();
        }
      };

      authStore = new AuthStore(() => currentTime, fakeConfig, {}, fakeDecode, fakeAnalyticsService, fakeLoggerService, fakeRouter, new BindingEngine(), eventAggregator, GenericService);
      authStore.setSession({expiresIn: 0, idToken: '1'});
    });
  });

  describe('When user logs out', () => {
    beforeEach(done => {
      currentTime = new Date().getTime();
      localStorage.setItem('expires_at', new Date().getTime());
      localStorage.setItem('bob', 'do not delete!!!');
      authStore.eventAggregator.publish(AUTH_EVENTS.LOGOUT);
      setImmediate(done);
    });

    it('clears ONLY auth keys from local storage', () => {
      expect(localStorage.getItem('expires_at')).toEqual(null);
      expect(localStorage.getItem('bob')).toEqual('do not delete!!!');
    });

    it('user gets redirected to logout page', () => {
      expect(spyWebAuthLogout).toHaveBeenCalledWith( { returnTo: logoutURL });
    });
  });

  describe('Export enabled for user', () => {

    let isExportEnabled, fakeJwtDecode, fakeCurrentTime;

    const createAuthStoreWithJwtDecode = (jwtDecode) =>
      new AuthStore(fakeCurrentTime, fakeConfig, {}, jwtDecode, fakeAnalyticsService, fakeLoggerService, fakeRouter, new BindingEngine(), eventAggregator, {});

    const createAuthStore = () =>
      createAuthStoreWithJwtDecode(fakeJwtDecode);

    beforeEach(() => {
      const currentTime = new Date().getTime();
      localStorage.setItem('expires_at', currentTime + 30);
      fakeCurrentTime = () => currentTime;
      fakeJwtDecode = () => ({
        nickname: 'example',
        name: 'example@example.com',
        'https://ovumforecaster.com/': {
          company: 'example ltd',
          exportEnabled: isExportEnabled
        }
      });
    });

    it('no user', () => {
      const authStore = createAuthStoreWithJwtDecode(() => ({}));
      expect(authStore.isExportEnabled()).toBeFalsy();
    });

    it('user has export enabled', () => {
      isExportEnabled = true;
      const authStore = createAuthStore();
      expect(authStore.isExportEnabled()).toBeTruthy();
    });

    it('user does not have export enabled', () => {
      isExportEnabled = false;
      const authStore = createAuthStore();
      expect(authStore.isExportEnabled()).toBeFalsy();
    });
  });
});
