import staticFileService from '../../services/staticFileService';
require('./data-methodology.scss');

export class DataMethodology { 
  static inject() {
    return [ staticFileService ];
  }

  constructor(staticFileService) {
    this.staticFileService = staticFileService;
  }

  getPdf() {
    const filename = 'subscription-forecast-methodology.pdf';
    this.staticFileService.fetchFileBlobURL(filename).then((pdfURL) => {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(pdfURL);
      }
      else {
        window.open(pdfURL);
      }
    });
  }
}
