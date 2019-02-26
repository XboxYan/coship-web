import React, { PureComponent } from 'react';
import { Control  } from 'react-keeper';

class Appbar extends PureComponent {
  onBack = ()=>{
    if(window.history.length<=2){
      Control.go('/');
    }else{
      Control.go(-1);
    }
  }  
  render() {
    return (
      <div className="appbar">
          <a className="appbtn center" onClick={this.onBack} ></a>
          <span>{this.props.title}</span>
      </div>
    )
  }
}

export default Appbar
