const STATES = {
  UNCHECKED: 0,
  CHECKED: 1,
  INDETERMINATE: 2
};

export const itemIndeterminate = item => item.state === STATES.INDETERMINATE;

export const itemChecked = item => item.state === STATES.CHECKED;

export const itemUnchecked = item => item.state === STATES.UNCHECKED;

export const itemChildren = item => item && item.children ? item.children : [];

export const updateListState = item => {
  const children = itemChildren(item).map(updateListState);
  const indeterminate = children.length && (children.some(itemIndeterminate) || (
    children.some(itemChecked) && children.some(itemUnchecked)
  ));
  const checked = children.length ? children.every(itemChecked) : item.state === STATES.CHECKED;
  return {
    ...item,
    children,
    state: checked ? STATES.CHECKED : indeterminate ? STATES.INDETERMINATE : STATES.UNCHECKED
  };
};

export const navigate = (data, path) => {
  const inner = (acc, step) => !acc ? acc : itemChildren(acc.find(item => item.name === step));
  return path.reduce(inner, data);
};

/**
 * Sort list by children ascending. Required for setLevels.
 * @param list
 */
export const sortByLength = list =>
  list.sort((a, b) => {
    a = a.children ? a.children.length : 0;
    b = b.children ? b.children.length : 0;
    return a - b;
  });

/**
 * Set levels for each dimension
 * @param list
 * @param level
 */
export function setLevels(list, level = 1) {
  sortByLength(list).forEach((v, i, arr) => {
    v.level = level;
    if (v.children && v.children.length && i === arr.length - 1) {
      level += 1;
      list.filter(v => v.children && v.children.length)
        .forEach(v => { list = setLevels(sortByLength(v.children), level); });
    }
  });
}

export function flattenHierarchicalList(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((a, b) => {
      if (b.children && b.children.length) {
        return a.concat(b).concat(flattenHierarchicalList(b.children));
      } else {
        return a.concat(b);
      }
    }, []);
}

export function flattenListAndMergeState(newList, oldFlatList) {
  const flatNewList = flattenHierarchicalList(newList);
  for (let i = 0; i < flatNewList.length; i++) {
    flatNewList[i].state = oldFlatList[i].state;
  }

  return flatNewList;
}

export function flattenAndGetLeafNodes(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce(function iterate(a, b) {
      if (Array.isArray(b.children) && b.children.length > 0) {
        return b.children.reduce(iterate, a);
      }
      a.push(b);
      return a;
    }, []);
}
