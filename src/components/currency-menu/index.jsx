import React from 'react';
import mountReact from '../../mountReact';
import { Anchor, Menu, Container, ListItem, CheckIconWrapper, ItemTitle, ItemToolTip } from './styles';
import { currencyMap, currencyOrder } from './currencies';
import ToolTip from '../tooltip_react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons/faMoneyBillAlt';
import './currency-menu.scss';

class CurrencyMenu extends React.Component {
  static currencyDecriptions = {
    usd: 'Financial metrics are displayed in USD',
    undefined: 'Financial metrics are displayed in USD',
    valueeur: 'Financial metrics are displayed in EURO',
    valuereported: 'Financial metrics are displayed in the currency used by the company in financial reporting. Columns are locked at Country and Company level when Reported is selected. Only reported financial metrics are displayed.',
    valuelocal: 'Financial metrics are displayed in the currency of the country where the company operates. Columns are locked at Country level when local is selected'
  }

  constructor(props) {
    super(props);
  }

  close = this.close.bind(this)
  state = { opened: false }

  toggleMenu(e) {
    e.preventDefault();

    if (this.props.disabled) {
      return;
    }
    
    this.setState((prevState) => ({
      opened: !prevState.opened
    }), () => {
      document.addEventListener('click', this.close);
    });
  }

  onCurrencySelect(currency) {
    const { changeValueField } = this.props;
    changeValueField(currency);
    this.setState({
      opened: false
    }, () => document.removeEventListener('click', this.close));
  }

  close(e) {
    if(!this.menu.contains(e.target)) {
      this.setState({ opened: false }, () => {
        document.removeEventListener('click', this.close);
      });
    }
  }
  
  render() {
    const { opened } = this.state;
    const { currency } = this.props;

    return (
      <Container>
        <Anchor onClick={(e) => this.toggleMenu(e)} data-selector="show-currency-menu-button" href="#" className={this.props.disabled ? 'disabled' : ''}>
          <FontAwesomeIcon icon={faMoneyBillAlt} size="lg" fixedWidth className="fa-padded" />Currency: {currency !== null && currencyMap[currency]}
        </Anchor>
        {opened &&
          <Menu ref={el => this.menu = el}>
            <ul>
              {currencyOrder.map((item, idx) => (
                <ListItem key={idx} onClick={() => this.onCurrencySelect(item)}>
                  {item === currency && (
                    <CheckIconWrapper>
                      <i className="material-icons check"></i>
                    </CheckIconWrapper>
                  )}
                  <ItemTitle>
                    {currencyMap[item]}
                  </ItemTitle>
                  <ItemToolTip>
                    <ToolTip content={CurrencyMenu.currencyDecriptions[item]} />
                  </ItemToolTip>
                </ListItem>
              ))}
            </ul>
          </Menu>
        }
      </Container>
    );
  }
}

export default mountReact(CurrencyMenu, 'currency-menu');
