import React from 'react';
import { Container, HooverBox } from './styles';

class ToolTip extends React.Component {
  close = this.close.bind(this)
  state = { opened: false }

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState((prevState) => ({
      opened: !prevState.opened
    }), () => {
      document.addEventListener('click', this.close);
    });
  }

  close() {
    this.setState({ opened: false }, () => {
      document.removeEventListener('click', this.close);
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.close);
  }

  render() {
    const { opened } = this.state;
    const { content } = this.props;

    return (
      <Container active={opened}>
        <span>
          <i className="material-icons info"
            onClick={this.toggle.bind(this)}
          ></i>
        </span>
        {opened &&
          <HooverBox innerRef={el => this.hooverBox = el}>
            {content}
          </HooverBox>
        }
      </Container>
    );
  }
}

export default ToolTip;
