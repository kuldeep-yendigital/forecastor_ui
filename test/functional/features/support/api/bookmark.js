const request = require('request-promise-native');

class BookmarkClient {

  constructor({
    baseUrl,
    accessToken
  }) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.headers = {
      'Authorization': `Bearer ${this.accessToken}`
    };
    this.options = {
      json: true
    };
  }

  mergeParams(params) {
    return Object.assign({}, this.options, params);
  }

  getUrl(path) {
    return `${this.baseUrl}${path}`;
  }

  getAllPopularBookmarks() {
    return request.get(this.mergeParams({
      url: this.getUrl('/bookmark/popular'),
      headers: this.headers
    }));
  }

  getAllUserBookmarks() {
    return request.get(this.mergeParams({
      url: this.getUrl('/bookmark'),
      headers: this.headers
    }));
  }

  createBookmark(bookmark) {
    return request.post(this.mergeParams({
      url: this.getUrl('/bookmark'),
      headers: this.headers,
      body: bookmark
    }));
  }

  getBookmark(hash) {
    return request.get(this.mergeParams({
      url: this.getUrl(`/bookmark/${hash}`),
      headers: this.headers
    }));
  }

  deleteBookmark(hash) {
    return request.delete(this.mergeParams({
      url: this.getUrl(`/bookmark/${hash}`),
      headers: this.headers
    }));
  }

  deleteAllUserBookmarks() {
    return this.getAllUserBookmarks()
      .then(bookmarks => {
        return Promise.all(bookmarks.map(bookmark => {
          return this.deleteBookmark(bookmark.hash);
        }));
      });
  }

}

module.exports = BookmarkClient;
