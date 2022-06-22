export class PropertyFilterValueConverter {
  /**
   * @param  {Array} set
   * @param  {String} property
   * @param  {String} value
   * @return {Array}
   */
  toView(set, property, value) {
    return Array.isArray(set)
      ? set.filter(item => item.hasOwnProperty(property) && item[property] === value)
      : [];
  }
}
