import getHeadersForInterval from './get-headers-for-interval';

describe('yearly headers', () => {
  let getYearlyHeaders;
  beforeEach(() => {
    getYearlyHeaders = getHeadersForInterval('yearly');
  });

  it('are like this', () => {
    const headers = getYearlyHeaders(new Date('01/01/2014'), new Date('01/01/2016'));

    const expectedHeaders = [
      {key: '31/12/2014', label: '2014'},
      {key: '31/12/2015', label: '2015'},
      {key: '31/12/2016', label: '2016'}
    ];
    expect(headers).toEqual(expectedHeaders);
  });
});
