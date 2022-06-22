import { AnalyticsService } from './analyticsService';

describe('Analytics Service', () => {

  let analyticsService, timeout = 0, callbackCallCount, callbackCalled, callbackMock;

  beforeEach(() => {
    callbackCallCount = 0;
    callbackCalled = () => callbackCallCount > 0;
    callbackMock = () => {
      ++ callbackCallCount;
    };

    window.dataLayer = [];
    analyticsService = new AnalyticsService(timeout, {
      createLogger: () => ({ info: () => {} })
    });
  })

  describe('Push Event', () => {

    beforeEach(() => {
      AnalyticsService.register({
        EXAMPLE: 'example'
      });
    });

    it('adds events to the data layer', () => {
      analyticsService.pushEvent('example');
      expect(window.dataLayer[0].event).toBe('example');
    });

    it('passes through callback to the data layer', () => {
      analyticsService.pushEvent('example', callbackMock);
      expect(callbackCalled()).toBe(false);
      window.dataLayer[0].eventCallback();
      expect(callbackCalled()).toBe(true);
    });

    it('triggers the callback after a timeout', (done) => {
      analyticsService.pushEvent('example', callbackMock);
      expect(callbackCalled()).toBe(false);
      setTimeout(() => {
        expect(callbackCalled()).toBe(true);
        done();
      }, timeout);
    });

    it('only triggers the callback once', () => {
      analyticsService.pushEvent('example', callbackMock);
      expect(callbackCallCount).toBe(0);
      window.dataLayer[0].eventCallback();
      expect(callbackCallCount).toBe(1);
      window.dataLayer[0].eventCallback();
      expect(callbackCallCount).toBe(1);
    });

    it('does not add a callback if none provided', () => {
      analyticsService.pushEvent('example');
      expect(window.dataLayer[0].eventCallback).toBeUndefined();
    });

    it('adds data from the event', () => {
      analyticsService.pushEvent('example', {
        a: 1,
        b: 2,
        c: 3
      }, () => {});
      expect(window.dataLayer[0].a).toBe(1);
      expect(window.dataLayer[0].b).toBe(2);
      expect(window.dataLayer[0].c).toBe(3);
    });
  });

  describe('Push Exception', () => {
    it('adds error data to the dataLayer', () => {
      analyticsService.pushException('example error');
      expect(window.dataLayer[0].event).toBe('exception');
      expect(window.dataLayer[0].exDescription).toBe('example error');
      expect(window.dataLayer[0].exFatal).toBe(false);
    });

    it('passes through callback to the dataLayer', () => {
      analyticsService.pushException('example error', callbackMock);
      expect(callbackCalled()).toBe(false);
      window.dataLayer[0].eventCallback();
      expect(callbackCalled()).toBe(true);
    });

    it('adds fatal error to dataLayer', () => {
      analyticsService.pushException('example error', true);
      expect(window.dataLayer[0].event).toBe('exception');
      expect(window.dataLayer[0].exDescription).toBe('example error');
      expect(window.dataLayer[0].exFatal).toBe(true);
    });

    it('adds fatal error to dataLayer with callback', () => {
      analyticsService.pushException('example error', true, callbackMock);
      expect(callbackCalled()).toBe(false);
      window.dataLayer[0].eventCallback();
      expect(callbackCalled()).toBe(true);
    });
  })

});
