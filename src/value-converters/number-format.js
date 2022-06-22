export const toZeroDecimalPlaces = number => number !== null ? Number(number).toFixed(0) : '';
export const toTwoDecimalPlaces = number => Number(number).toFixed(2);
export const addCommas = number => number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
