import React, { PureComponent } from 'react';
import LoginView from './LoginView';
import { Link } from 'react-keeper';
import PropTypes from 'prop-types';

class UserInfo extends PureComponent {
    render(){
        const {logo,nickName,userCode} = JSON.parse(localStorage.getItem("$loginInfo"))
        return [
            <div key="user-top" className="user-top center">
                <img className="movie_bg" src={window.Base+logo} alt="" />
                <Link className="user-head" src={window.Base+logo} alt="" type='img' to={'/me/settings'} />
                <h2 className="user-name">{nickName||userCode}</h2>
            </div>,
            <Link key="user-tv" className="user-tv" type='div' to={'/me/devices'}>我的电视</Link>
        ]
    }
}

export default class Me extends PureComponent {
    render() {
        const {loginState} = this.context;
        return (
            <div className="flex">
                <div className="header">{loginState?'个人信息':'登录'}</div>
                {
                    loginState?
                    <UserInfo />
                    :
                    <LoginView />
                }
            </div>
        );
    }
}

Me.contextTypes = {
    loginState: PropTypes.bool,
    setLoginState: PropTypes.func
};
