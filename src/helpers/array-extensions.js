import lodashRange from 'lodash/range';
import forEach from 'lodash/forEach';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';

export const range = (start, end) => lodashRange(start, end + 1, 1);

export function flatten(list) {
  return list.reduce((a, b) => a.concat((b.children && b.children.length) ? flatten(b.children) : b), []);
}

export function findDeep(collection, predicate, ctx) {
  let result;

  forEach(collection, (value) => {
    const isMatch = predicate.call(ctx, value);
    if (isMatch) {
      result = value;
    }
    else {
      if (value.children && Array.isArray(value.children)) {
        result = findDeep.call(this, value.children, predicate, ctx);
      }
    }

    if (!isUndefined(result)) {
      return false;
    }
  }, this);

  return result;
}
