import { DatapointFormatterValueConverter } from './datapoint-formatter';

describe('Data point formatter', () => {
  let formatter;

  beforeEach(() => {
    formatter = new DatapointFormatterValueConverter()
  });

  it('should ignore undefined', () => {
    expect(formatter.toView()).toEqual(undefined);
  });

  it('should default to empty string if value is of type null', () => {
    expect(formatter.toView({type: 'numeric', value: null})).toEqual('');
  });

  it('should not format non-numeric (undefined) types', () => {
    expect(formatter.toView('123')).toEqual('123');
    expect(formatter.toView('456')).toEqual('456');
  });

  it('should format numeric types without decimals', () => {
    expect(formatter.toView({type: 'numeric', value: '001'})).toEqual('1');
    expect(formatter.toView({type: 'numeric', value: '1.0'})).toEqual('1');
    expect(formatter.toView({type: 'numeric', value: '22800'})).toEqual('22,800');
    expect(formatter.toView({type: 'numeric', value: '1000'})).toEqual('1,000');
  });


  it('should format numeric types without decimals', () => {
    expect(formatter.toView({type: 'percentage', value: '001'})).toEqual('1.00');
    expect(formatter.toView({type: 'percentage', value: '1.0'})).toEqual('1.00');
    expect(formatter.toView({type: 'percentage', value: '22800'})).toEqual('22,800.00');
    expect(formatter.toView({type: 'percentage', value: '1000'})).toEqual('1,000.00');
  });

  it('should round numeric types to zero decimals', () => {
    expect(formatter.toView({type: 'numeric', value: '1.2345'})).toEqual('1');
  });

  it('should round percentage types to two decimals', () => {
    expect(formatter.toView({type: 'percentage', value: '1.2345'})).toEqual('1.23');
  });
});
