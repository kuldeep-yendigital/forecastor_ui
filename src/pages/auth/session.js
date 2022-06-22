const toUserDetailsFromDecodedJwt = decoded => {
  const id = decoded.sub;
  const name = decoded.name;
  const email = decoded.nickname;
  const userMetadata = decoded['https://ovumforecaster.com/account'] || {};
  const salesforceUserId = userMetadata.salesforceUserId;
  const salesforceBaseUrl = userMetadata.salesforceBaseUrl;
  const samsParentId = userMetadata.samsParentId || null;
  const company = userMetadata.company;
  const exportEnabled = userMetadata.exportEnabled;
  const products = userMetadata.hasOwnProperty('productIds') && Array.isArray(userMetadata.productIds)
    ? userMetadata.productIds.map((val) => {
      const product = val.split('-');

      return {
        id   : product[0].toString(),
        type : parseInt(product[1], 10)
      };
    })
    : [];

  return { id, products, salesforceUserId, salesforceBaseUrl, name, company, email, exportEnabled, samsParentId };
};

export default class Session {

  constructor(currentTime, jwtDecode, router) {
    this.jwtDecode = jwtDecode;
    this.currentTime = currentTime;
    this.router = router;
  }

  start(authResult) {
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', authResult.expiresIn * 1000 + this.currentTime());

    if (authResult.idToken) {
      trackUserDetails(toUserDetailsFromDecodedJwt(this.jwtDecode(authResult.idToken)));
    }

    this.restoreUrl();
  }

  restoreUrl() {
    const bookmarkId = localStorage.getItem('bookmarkId');

    if (bookmarkId) {
      setImmediate(() => {
        this.router.navigateTo.grid({s: bookmarkId});
      });
      localStorage.removeItem('bookmarkId');
    }
  }

  end() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
  }

  getUser() {
    if(!this.isValid()) return null;
    return toUserDetailsFromDecodedJwt(this.jwtDecode(localStorage.getItem('id_token')));
  }

  isValid() {
    return this.currentTime() < localStorage.getItem('expires_at');
  }
}

function trackUserDetails({name, company, email}) {
  const id = email;

  if (typeof(FS) !== 'undefined') {
    FS.identify(id, {
      displayName: id
    });

    FS.setUserVars({
      name_str: name,
      company_str: company
    });
  }

}
