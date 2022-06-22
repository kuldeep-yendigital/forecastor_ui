import {range} from '../../helpers/array-extensions';

export default function getYearlyHeaders(startDate, endDate) {
  const yearRange = range(startDate.getUTCFullYear(), endDate.getUTCFullYear());
  return yearRange.map(x => {
    return {key:  `31/12/${x}`, label: x.toString()};
  });
}
