import getQuarterlyHeaders from './get-quarterly-headers'
import getYearlyHeaders from './get-yearly-headers'

export default function getHeaderForInterval(interval) {
  switch(interval) {
    case 'quarterly' :
      return getQuarterlyHeaders;
    case 'yearly' :
      return getYearlyHeaders;
  }
}
