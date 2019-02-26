import React, { PureComponent } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class AnimatePage extends PureComponent {
  render() {
    return (
      <ReactCSSTransitionGroup
        component="div"
        className="view"
        transitionName="animated"
        transitionAppear={true}
        transitionEnter={false}
        transitionLeave={false}
        transitionAppearTimeout={500}>
          {this.props.children} 
      </ReactCSSTransitionGroup>
    )
  }
}