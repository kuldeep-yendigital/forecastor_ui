import staticFileService from '../../services/staticFileService';
require('./help.scss');

export class Help {
  static inject() {
    return [ staticFileService ];
  }

  constructor(staticFileService) {
    this.staticFileService = staticFileService;
  }

  getPdf() {
    const filename = 'ovum-forecaster-help-and-training-guide.pdf';
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