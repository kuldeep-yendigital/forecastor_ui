import {addCommas, toTwoDecimalPlaces, toZeroDecimalPlaces} from "./number-format";

export class DatapointFormatterValueConverter {
  toView(field) {
    if(field && null === field.value)
      return '';

    if(field && field.type === 'numeric') {
      if(field.isCurrency)
        return addCommas(toTwoDecimalPlaces(field.value));

      return addCommas(toZeroDecimalPlaces(field.value));
    }

    if(field && field.type === 'percentage')
      return addCommas(toTwoDecimalPlaces(field.value));

    return field;
  }
}
