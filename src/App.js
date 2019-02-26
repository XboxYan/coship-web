import React, { PureComponent } from 'react';
import { BrowserRouter, Route } from 'react-keeper';
import Home from './pages';
import MovieDetail from './pages/Movie/MovieDetail';
import LiveDetail from './pages/Live/LiveDetail';
import Search,{SearchList} from './pages/Movie/Search';
import MovieMore from './pages/Movie/MovieMore';
import Remote from './pages/Me/Remote';
import Settings from './pages/Me/Settings';
import Devices from './pages/Me/Devices';
import {LoginPop} from './pages/Me/LoginView';
import Notifications from 'react-notify-toast';
import PropTypes from 'prop-types';

class App extends PureComponent {
  state = {
    loginState:false
  }
  getChildContext() {
      return {
          loginState: this.state.loginState,
          setLoginState:this.setLoginState
      };
  }
  setLoginState = (loginState) => {
      this.setState({loginState});
  }
  componentDidMount() {
    const loginInfo = JSON.parse(localStorage.getItem("$loginInfo"));
    if(loginInfo){
        this.setLoginState(true);
    }
  }
  render() {
    return (
      <BrowserRouter>
        <div className="flex">
          <Notifications />
          <Route index miss cache='parent' component={ Home } path="/" />
          <Route component={ MovieMore } path='/movie/moviemore/:id' />
          <Route component={ Search } path='/movie/search' />
          <Route component={ SearchList } path='/movie/search/:id' />
          <Route component={ MovieDetail } path="/moviedetail/:id>" />
          <Route component={ LiveDetail } path="/livedetail/:id" />
          <Route component={ Remote } path="/remote>" />
          <Route component={ LoginPop } path="/login>" />
          <Route component={ Settings } path="/settings>" />
          <Route component={ Devices } path="/devices>" />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;


App.childContextTypes = {
  loginState: PropTypes.bool,
  setLoginState: PropTypes.func
};
