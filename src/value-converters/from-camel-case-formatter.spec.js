import {FromCamelCaseFormatterValueConverter} from './from-camel-case-formatter';

describe('FromCamelCaseFormatter', () => {

  it('converts a camel case field value into capitalized words', () => {
    expect(new FromCamelCaseFormatterValueConverter().toView('ThisIsADataset')).toBe('This Is A Dataset')
  });

})
