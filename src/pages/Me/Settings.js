import React, { PureComponent } from 'react';
import fetchData from '../../util/Fetch';
import AnimatePage from '../../component/AnimatePage';
import {notify} from 'react-notify-toast';
import Appbar from '../../component/Appbar';
import { Control  } from 'react-keeper';
import PropTypes from 'prop-types';

export default class Settings extends PureComponent {

    loginout = async () => {
        const userCode = localStorage.getItem("$userCode");
        let data = await fetchData('LoginOut', {
            par:{
                userCode:userCode,
            }
        })
        if(data.success==="1"){
            notify.show('已退出登录！',"success", 2000);
            localStorage.setItem('$loginInfo',null);
            this.context.setLoginState(false);
            Control.go(-1);
        }else{
            notify.show(data.info,"error", 2000);
        }
    }

    render() {
        return (
            <AnimatePage>
                <Appbar title='设置' />
                <div className="page">
                    <div onClick={this.loginout} className="loginout">退出登录</div>
                </div>
            </AnimatePage>
        );
    }
}

Settings.contextTypes = {
    setLoginState: PropTypes.func
};