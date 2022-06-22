/* global describe, expect, it, spyOn, beforeEach */
import { GenericService } from './genericService';

describe('GenericService', () => {
  describe('fetch', () => {
    let service;
    let fakeHttpFetch;
    let spy;
  
    const fakeConfig = {
      get: () => { 
        return 'url';
      }
    };
  
    beforeEach(() => {
      fakeHttpFetch = {
        fetch: () => Promise.resolve({
          ok: true,
          json: () => { return {}; }
        })
      };
  
      spy = spyOn(fakeHttpFetch, 'fetch').and.callThrough();
      service = new GenericService(fakeHttpFetch, fakeConfig);
    });
  
    it('should call the httpFetch with the requested url', (done) => {
      service.fetch('/url').then(() => {
        expect(spy).toHaveBeenCalledWith('/url', {});
        done();
      });
    });
  });
});
