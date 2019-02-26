import React, { Component } from 'react';

const styles = {
  dot: {
    backgroundColor: '#e4e6e7',
    height: 8,
    width: 8,
    borderRadius: 4,
    margin:'0 2px',
    outline:'none',
    transition:'.3s'
  },
  active: {
    backgroundColor: '#4aa3fe',
    width:'14px'
  },
};

export default class PaginationDot extends Component {

  handleClick = (event) => {
    
  };

  render() {
    const {
      active,
    } = this.props;

    let styleDot;

    if (active) {
      styleDot = Object.assign({}, styles.dot, styles.active);
    } else {
      styleDot = styles.dot;
    }

    return (
      <div style={styleDot} />
    );
  }
}