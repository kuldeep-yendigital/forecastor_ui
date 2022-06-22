import 'isomorphic-fetch';
import { HttpClient } from 'aurelia-fetch-client';

export class GenericService {

  static inject() {
    return [HttpClient, 'config'];
  }

  constructor(HttpClient, config) {
    this.config = config;
    this.httpClient = HttpClient;
  }

  fetchFrom(api, url) {
    return this.fetch(`${this.config.get(api)}/${url}`);
  }

  fetch(path, options = {}) {
    return this.httpClient.fetch(path, options)
      .then((response) => {
        if (response.status === 204) {
          return response;
        }
        if (response.status === 404) {
          return [];
        }
        if (response.ok) {
          return response.json();
        } 
        throw Error(`[${response.status}] Bad response from server (${response.url})`);
      })
      .catch((err) => {
        throw err;
      });
  }
}
