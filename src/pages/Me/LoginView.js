import React, { PureComponent } from 'react';
import fetchData from '../../util/Fetch';
import {notify} from 'react-notify-toast';
import AnimatePage from '../../component/AnimatePage';
import { Control } from 'react-keeper';
import Appbar from '../../component/Appbar';
import PropTypes from 'prop-types';

export default class Login extends PureComponent {
    
    state = {
        userCode:'',
        passWord:''
    }

    onChangeUser = (e) => {
        this.setState({userCode: e.target.value});
    }

    onChangePwd = (e) => {
        this.setState({passWord: e.target.value});
    }

    onSubmit = async () => {
        const {userCode,passWord} = this.state;
        if(userCode===""||passWord===""){
            notify.show('用户或密码不能为空',"error", 2000);
            return;
        }
        if(passWord.length<6){
            notify.show('密码长度小于6',"error", 2000);
            return;
        }
        let data = await fetchData('Login', {
            par:{
                userCode,
                passWord
            }
        })
        if(data.success==="1"){
            //deviceId:'8C34FDB809B5'
            notify.show('登录成功！',"success", 2000);
            const {userInfo:{nickName,logo,deviceId=null}} = data; 
            const logInfo = {
                userCode,
                nickName,
                logo,
                deviceId
            }
            localStorage.setItem('$loginInfo',JSON.stringify(logInfo));
            localStorage.setItem('$userCode',userCode);
            this.context.setLoginState(true);
            if(this.props.goback){
                Control.go(-1);
            }
        }else{
            notify.show(data.info,"error", 2000);
        }
        
    }

    componentDidMount() {
        const userCode = localStorage.getItem("$userCode");
        if(userCode){
            this.setState({userCode:userCode});
        }
    }

    render() {
        const {userCode} = this.state;
        return (
            <div className="flex center">
                <input autoComplete="off" maxLength={11} className="logininput" type="text" placeholder="手机号" onChange={this.onChangeUser} value={userCode} />
                <input autoComplete="off" maxLength={16} className="logininput" type="password" placeholder="密码" onChange={this.onChangePwd} />
                <a className="loginbtn" onClick={this.onSubmit}>登录</a>
            </div>
        );
    }
}

const LoginPop = () => (
    <AnimatePage>
        <Appbar title='登录' />
        <Login goback={true} />
    </AnimatePage>
)

export {LoginPop};

Login.contextTypes = {
    setLoginState: PropTypes.func
};