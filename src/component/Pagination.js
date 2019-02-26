import React, { Component } from 'react';

import PaginationDot from './PaginationDot';

const styles = {
  root: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    display: 'flex',
    flexDirection: 'row',
  },
};

export default class Pagination extends Component {

  render() {
    const {
      index,
      dots,
    } = this.props;

    const children = [];

    for (let i = 0; i < dots; i += 1) {
      children.push(
        <PaginationDot
          key={i}
          index={i}
          active={i === index}
        />,
      );
    }

    return (
      <div style={styles.root}>
        {children}
      </div>
    );
  }
}