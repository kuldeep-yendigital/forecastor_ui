import {formatCamelCase} from '../helpers/format';

export class FromCamelCaseFormatterValueConverter {
  toView(field) {
    return formatCamelCase(field);
  }
}
