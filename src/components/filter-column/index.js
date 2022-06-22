import React from 'react';
import mountReact from '../../mountReact';
import { SearchBox, Button, ItemList, SearchBoxWrapper, Label } from './styles';
import Checkbox from '../checkbox/checkbox_react';
import forEach from 'lodash/forEach';

/**
 * Keep track of outside changes to item checked state,
 * whilst keeping checked internal state.
 * @class FilterColumn
 * @extends {React.PureComponent}
 */
class FilterColumn extends React.PureComponent {
  state = {
    searchTerm: '',
    checked: [],
    toggled: []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data && (nextProps.data.length !== prevState.checked.length)) {
      const checked = new Array(nextProps.data.length).fill(false);
      if (nextProps.activeFilters) {
        forEach(nextProps.activeFilters, (val, key) => {
          if (key === nextProps.column) {
            // Find the item in the data
            forEach(val, (filter) => {
              const idx = nextProps.data.findIndex(el => el.name === filter);
              if (idx >= 0) {
                checked[idx] = true;
              } 
            });
          }
        });

        return {
          checked
        };
      }
    }
    else {
      return null;
    }
  }

  apply() {
    const { checked, toggled } = this.state;
    const { data, toggleItem } = this.props;

    toggled.forEach((idx) => {
      const state = checked[idx];
      toggleItem({
        column: this.props.column,
        item: data[idx],
        state: state ? 1 : 0
      });
    });

    this.setState({
      toggled: []
    });
  }

  toggleItem(idx) {
    const { checked, toggled } = this.state;
    const { data } = this.props;
    const newToggled = [...toggled];
    
    newToggled.push(idx);
    const newChecked = [...checked];
    newChecked[idx] = checked[idx] !== undefined ? !checked[idx] : !Boolean(data[idx].state);

    this.setState({ 
      checked: newChecked, 
      toggled: newToggled
    });
  }

  clear() {
    const { data } = this.props;
    const { checked } = this.state;

    for(let i = 0; i < checked.length; i++) {
      if(checked[i] === true) {
        this.props.toggleItem({
          column: this.props.column,
          item: data[i],
          state: 0
        });
      }
    }

    const newChecked = new Array(data.length).fill(false);
    this.setState({ checked: newChecked, toggled: [] });
  }

  updateSearch(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { data } = this.props;
    const { searchTerm, checked } = this.state;
    if (!data) return null;

    const filteredData = !searchTerm ? data : data.filter(item => (
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    return (
      <div>
        <SearchBoxWrapper>
          <SearchBox
            type="text"
            value={searchTerm}
            placeholder="Search..."
            onChange={(e) => this.updateSearch(e)}
          />
          <i className="material-icons search-icon search"></i>
        </SearchBoxWrapper>
        <ItemList>
          {filteredData.map((item) => {
            const idx = data.findIndex(el => el.id === item.id);
            return (
              <li key={idx} onClick={() => this.toggleItem(idx)}>
                <Checkbox checked={checked[idx] !== undefined ? checked[idx] : item.state === 1} readOnly={true} />
                <Label>{item.name}</Label>
              </li>
            );
          })}
        </ItemList>
        <Button onClick={() => this.clear()}>CLEAR</Button>
        <Button onClick={() => this.apply()}>APPLY</Button>
      </div>
    );
  }
}

export default mountReact(FilterColumn);