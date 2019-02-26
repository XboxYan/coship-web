import React, { PureComponent } from 'react';
import fetchData from '../../util/Fetch';
import AnimatePage from '../../component/AnimatePage';
import {notify} from 'react-notify-toast';
import Appbar from '../../component/Appbar';
import { Link,Control } from 'react-keeper';

export default class extends PureComponent {

    state = {
        deviceId : null,
        isShow : false,
        value: ''
    }

    loginout = async () => {
        // const loginInfo = JSON.parse(localStorage.getItem("$loginInfo"));
        // let data = await fetchData('LoginOut', {
        //     par:{
        //         userCode:loginInfo.userCode,
        //     }
        // })
        localStorage.setItem('$loginInfo',null);
        this.context.setLoginState(false);
        Control.go(-1);
    }

    addDevices = () => {
        this.setState({isShow:true});
    }

    onChange = (e) => {
        this.setState({value: e.target.value});
    }

    onCancle = () => {
        this.setState({
            isShow:false,
            value:''
        });
    }

    onSumbmit = async () => {
        const {value} = this.state;
        if(value.length===0){
            notify.show('不允许为空!',"error", 2000);
            return;
        }
        const logInfo = JSON.parse(localStorage.getItem("$loginInfo"));
        let data = await fetchData('BindCard', {
            par:{
                userCode:logInfo.userCode,
                cardNumber:value
            }
        })
        if(data.success==='1'){
            notify.show('绑定成功!',"success", 2000);
            this.setState({deviceId:value});
            const $logInfo = Object.assign({},logInfo,{deviceId:value});
            localStorage.setItem('$loginInfo',JSON.stringify($logInfo));
            this.onCancle();
        }else{
            notify.show(data.info,"error", 2000);
        }
    }

    cancelBind = async () => {
        const logInfo = JSON.parse(localStorage.getItem("$loginInfo"));
        let data = await fetchData('BindCard', {
            par:{
                userCode:logInfo.userCode,
                cardNumber:logInfo.deviceId,
                bindType:'1'
            }
        })
        if(data.success==='1'){
            notify.show('解除绑定成功!',"success", 2000);
            this.setState({deviceId:null});
            const $logInfo = Object.assign({},logInfo,{deviceId:null});
            localStorage.setItem('$loginInfo',JSON.stringify($logInfo));
        }else{
            notify.show(data.info,"error", 2000);
        }
    }

    componentDidMount() {
        const logInfo = JSON.parse(localStorage.getItem("$loginInfo"));
        this.setState({deviceId:logInfo.deviceId})
    }

    render() {
        const {isShow,value,deviceId} = this.state;
        return (
            <AnimatePage>
                <Appbar title='电视' />
                <div className="page">
                    {
                        deviceId?
                        <div className="device_item center">
                            <Link className="flex" to="/remote" type="span">tv-{deviceId}</Link>
                            <a className="device_cancle" onClick={this.cancelBind} >解除绑定</a>
                        </div>
                        :
                        <div onClick={this.addDevices} className="devicebtn">添加设备</div>
                    }
                    <div className={`device_window${isShow?" show":""}`}>
                        <h2 className="device_tip">请输入电视设备号</h2>
                        <input className="device_input" onChange={this.onChange} value={value} />
                        <div className="device_act">
                            <a onClick={this.onCancle}>取消</a>
                            <a onClick={this.onSumbmit}>确定</a>
                        </div>
                    </div>
                </div>
            </AnimatePage>
        );
    }
}
