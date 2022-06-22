import get from 'lodash/get';

export function getConf() {
  return {
    get(key) { return window.config[key]; }
  };
}

/**
 * Get value by key or return default value
 *
 * Example usage:
 *  import config from 'client.config.provider';
 *  config('timeframe.maximumTimerangeYears', 10);
 *
 * @param  {String} key
 * @param  {Mixed} defaultValue
 * @return {Mixed}
 */
export default function(key, defaultValue) {
  return get(window.config, key, defaultValue);
}



