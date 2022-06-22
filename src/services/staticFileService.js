import { HttpClient } from 'aurelia-fetch-client';

export default class StaticFileService {
  static inject() {
    return [HttpClient, 'config'];
  }

  constructor(httpClient, config) {
    this.httpClient = httpClient;
    this.config = config;
  }

  fetchFileBlobURL(filename) {
    const fileUrl = `${this.config.get('getFileUrl')}/${filename}`;

    return this.httpClient.fetch(fileUrl).then((response) => {
      if (response && response.status < 400) {
        return response.arrayBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: 'application/pdf' });
          const objectURL = URL.createObjectURL(blob);
          return objectURL;
        });
      }
      else {
        return Promise.reject('Error fetching file.');
      }
    });
  }
}