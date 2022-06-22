import {applySelection} from './index';

describe('applySelection(items, path, checked)', () => {
  it('checks all children if parent is checked', () => {
    const source = [
      { name: 'Metric', checked: false, indeterminate: false, children: [
        { name: 'Subscriptions', checked: false, indeterminate: false, children: [] },
        { name: 'CAPEX', checked: false, indeterminate: false, children: [] },
        { name: 'EBT', checked: false, indeterminate: false, children: [] }
      ] }
    ];

    const expected = [
      { name: 'Metric', checked: true, indeterminate: false, children: [
        { name: 'Subscriptions', checked: true, indeterminate: false, children: [] },
        { name: 'CAPEX', checked: true, indeterminate: false, children: [] },
        { name: 'EBT', checked: true, indeterminate: false, children: [] }
      ] }
    ];

    const actual = applySelection(source, [0], true);

    expect(actual).toEqual(expected);
  });

  it('marks parent indeterminate if some children are checked', () => {
    const source = [
      { name: 'Metric', checked: false, indeterminate: false, children: [
        { name: 'Subscriptions', checked: false, indeterminate: false, children: [] },
        { name: 'CAPEX', checked: false, indeterminate: false, children: [] },
        { name: 'EBT', checked: false, indeterminate: false, children: [] }
      ] }
    ];

    const expected = [
      { name: 'Metric', checked: false, indeterminate: true, children: [
        { name: 'Subscriptions', checked: true, indeterminate: false, children: [] },
        { name: 'CAPEX', checked: true, indeterminate: false, children: [] },
        { name: 'EBT', checked: false, indeterminate: false, children: [] }
      ] }
    ];

    const actual = [
      [[0, 0], true],
      [[0, 1], true]
    ].reduce((result, [path, checked]) => applySelection(result, path, checked), source);

    expect(actual).toEqual(expected);
  });

  it('unchecks parent if all children are unchecked', () => {
    const source = [
      { name: 'Metric', checked: true, indeterminate: false, children: [
        { name: 'Subscriptions', checked: true, indeterminate: false, children: [] },
        { name: 'CAPEX', checked: true, indeterminate: false, children: [] },
        { name: 'EBT', checked: true, indeterminate: false, children: [] }
      ] }
    ];

    const expected = [
      { name: 'Metric', checked: false, indeterminate: false, children: [
        { name: 'Subscriptions', checked: false, indeterminate: false, children: [] },
        { name: 'CAPEX', checked: false, indeterminate: false, children: [] },
        { name: 'EBT', checked: false, indeterminate: false, children: [] }
      ] }
    ];

    const actual = [
      [[0, 0], false],
      [[0, 1], false],
      [[0, 2], false]
    ].reduce((result, [path, checked]) => applySelection(result, path, checked), source);

    expect(actual).toEqual(expected);
  });

  it('checks parent if all children are checked', () => {
    const source = [
      { name: 'Metric', checked: false, indeterminate: false, children: [
        { name: 'Subscriptions', checked: false, indeterminate: false, children: [] },
        { name: 'CAPEX', checked: false, indeterminate: false, children: [] },
        { name: 'EBT', checked: false, indeterminate: false, children: [] }
      ] }
    ];

    const expected = [
      { name: 'Metric', checked: true, indeterminate: false, children: [
        { name: 'Subscriptions', checked: true, indeterminate: false, children: [] },
        { name: 'CAPEX', checked: true, indeterminate: false, children: [] },
        { name: 'EBT', checked: true, indeterminate: false, children: [] }
      ] }
    ];

    const actual = [
      [[0, 0], true],
      [[0, 1], true],
      [[0, 2], true]
    ].reduce((result, [path, checked]) => applySelection(result, path, checked), source);

    expect(actual).toEqual(expected);
  });

  it('unchecks all descendants if ancestor is unchecked', () => {
    const source = [
      { name: 'Technology', checked: true, indeterminate: false, children: [
        { name: 'Wireless', checked: true, indeterminate: false, children: [
          { name: 'Cellular', checked: true, indeterminate: false, children: [
            { name: '3G', checked: true, indeterminate: false, children: [] }
          ] }
        ] }
      ] }
    ];

    const expected = [
      { name: 'Technology', checked: false, indeterminate: false, children: [
        { name: 'Wireless', checked: false, indeterminate: false, children: [
          { name: 'Cellular', checked: false, indeterminate: false, children: [
            { name: '3G', checked: false, indeterminate: false, children: [] }
          ] }
        ] }
      ] }
    ];

    const actual = applySelection(source, [0], false);

    expect(actual).toEqual(expected);
  });

  it('checks all descendants if ancestor is checked', () => {
    const source = [
      { name: 'Technology', checked: false, indeterminate: false, children: [
        { name: 'Wireless', checked: false, indeterminate: false, children: [
          { name: 'Cellular', checked: false, indeterminate: false, children: [
            { name: '3G', checked: false, indeterminate: false, children: [] }
          ] }
        ] }
      ] }
    ];

    const expected = [
      { name: 'Technology', checked: true, indeterminate: false, children: [
        { name: 'Wireless', checked: true, indeterminate: false, children: [
          { name: 'Cellular', checked: true, indeterminate: false, children: [
            { name: '3G', checked: true, indeterminate: false, children: [] }
          ] }
        ] }
      ] }
    ];

    const actual = applySelection(source, [0], true);

    expect(actual).toEqual(expected);
  });

  it('marks ancestors as indeterminate if some decendants are checked', () => {
    const source = [
      { name: 'Technology', checked: true, indeterminate: false, children: [
        { name: 'Wireless', checked: true, indeterminate: false, children: [
          { name: 'Cellular', checked: true, indeterminate: false, children: [
            { name: '3G', checked: true, indeterminate: false, children: [] }
          ] }
        ] },
        { name: 'Wireline', checked: true, indeterminate: false, children: [
          { name: 'TV', checked: true, indeterminate: false, children: [] },
          { name: 'Fixed', checked: true, indeterminate: false, children: [] }
        ] }
      ] }
    ];

    const expected = [
      { name: 'Technology', checked: false, indeterminate: true, children: [
        { name: 'Wireless', checked: false, indeterminate: false, children: [
          { name: 'Cellular', checked: false, indeterminate: false, children: [
            { name: '3G', checked: false, indeterminate: false, children: [] }
          ] }
        ] },
        { name: 'Wireline', checked: false, indeterminate: true, children: [
          { name: 'TV', checked: false, indeterminate: false, children: [] },
          { name: 'Fixed', checked: true, indeterminate: false, children: [] }
        ] }
      ] }
    ];

    const actual = [
      [[0, 0, 0, 0], false],
      [[0, 1, 0], false],
    ].reduce((result, [path, checked]) => applySelection(result, path, checked), source);

    expect(actual).toEqual(expected);
  });

  it('unchecks ancestor if all descendants are unchecked', () => {
    const source = [
      { name: 'Technology', checked: true, indeterminate: false, children: [
        { name: 'Wireless', checked: true, indeterminate: false, children: [
          { name: 'Cellular', checked: true, indeterminate: false, children: [
            { name: '3G', checked: true, indeterminate: false, children: [] }
          ] }
        ] },
        { name: 'Wireline', checked: true, indeterminate: false, children: [
          { name: 'TV', checked: true, indeterminate: false, children: [] },
          { name: 'Fixed', checked: true, indeterminate: false, children: [] }
        ] }
      ] }
    ];

    const expected = [
      { name: 'Technology', checked: false, indeterminate: false, children: [
        { name: 'Wireless', checked: false, indeterminate: false, children: [
          { name: 'Cellular', checked: false, indeterminate: false, children: [
            { name: '3G', checked: false, indeterminate: false, children: [] }
          ] }
        ] },
        { name: 'Wireline', checked: false, indeterminate: false, children: [
          { name: 'TV', checked: false, indeterminate: false, children: [] },
          { name: 'Fixed', checked: false, indeterminate: false, children: [] }
        ] }
      ] }
    ];

    const actual = [
      [[0, 0, 0, 0], false],
      [[0, 1, 0], false],
      [[0, 1, 1], false]
    ].reduce((result, [path, checked]) => applySelection(result, path, checked), source);

    expect(actual).toEqual(expected);
  });

  it('checks ancestor if all decendants are checked', () => {
    const source = [
      { name: 'Technology', checked: false, indeterminate: false, children: [
        { name: 'Wireless', checked: false, indeterminate: false, children: [
          { name: 'Cellular', checked: false, indeterminate: false, children: [
            { name: '3G', checked: false, indeterminate: false, children: [] }
          ] }
        ] },
        { name: 'Wireline', checked: false, indeterminate: false, children: [
          { name: 'TV', checked: false, indeterminate: false, children: [] },
          { name: 'Fixed', checked: false, indeterminate: false, children: [] }
        ] }
      ] }
    ];

    const expected = [
      { name: 'Technology', checked: true, indeterminate: false, children: [
        { name: 'Wireless', checked: true, indeterminate: false, children: [
          { name: 'Cellular', checked: true, indeterminate: false, children: [
            { name: '3G', checked: true, indeterminate: false, children: [] }
          ] }
        ] },
        { name: 'Wireline', checked: true, indeterminate: false, children: [
          { name: 'TV', checked: true, indeterminate: false, children: [] },
          { name: 'Fixed', checked: true, indeterminate: false, children: [] }
        ] }
      ] }
    ];

    const actual = [
      [[0, 0, 0, 0], true],
      [[0, 1, 0], true],
      [[0, 1, 1], true]
    ].reduce((result, [path, checked]) => applySelection(result, path, checked), source);

    expect(actual).toEqual(expected);
  });
});
