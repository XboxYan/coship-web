import React, { PureComponent } from 'react';
import AnimatePage from '../../component/AnimatePage';
import Appbar from '../../component/Appbar';
import Fly from '../../util/Fly';

class ModelTouch extends PureComponent {

    timer = null;

    state = {
        dir:0
    }

    componentDidMount() {
        let view = document.getElementById('model');
        let pageX = 0;
        let pageY = 0;
        view.addEventListener('touchstart', function (e) {
            e.preventDefault();
            console.log(e.changedTouches)
            pageX = e.changedTouches[0].pageX;
            pageY = e.changedTouches[0].pageY;
        }, false);

        view.addEventListener('touchend', (e) => {
            let X = e.changedTouches[0].pageX - pageX;
            let Y = e.changedTouches[0].pageY - pageY;
            this.GetSlideDirection(X, Y);
        })

    }

    GetSlideDirection = (X, Y) => {
        const {fly} = this.props;
        if ( X*X + Y*Y < 200 ) {
            if( X === 0 && Y === 0 ) {
                console.log('点击');
                fly(23);
            }else{
                console.log('手抖了一下');
            } 
        } else {
            this.setState({dir:0});
            this.timer&&clearTimeout(this.timer);
            if (Math.abs(X) > Math.abs(Y) && X > 0) {
                this.setState({dir:2});
                console.log("向右");
                fly(22);
            }
            else if (Math.abs(X) > Math.abs(Y) && X < 0) {
                this.setState({dir:4});
                console.log("向左");
                fly(21);
            }
            else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
                this.setState({dir:3});
                console.log("向下");
                fly(20);
            }
            else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
                this.setState({dir:1});
                console.log("向上");
                fly(19);
            }
            this.timer = setTimeout(()=>{
                this.setState({dir:0});
            },500)
        }

    }

    componentWillUnmount() {
        document.getElementById('model').removeEventListener('touchstart', function (e) {
            e.stopPropagation();
        }, false);
        this.timer&&clearTimeout(this.timer);
    }

    render() {
        const { dir } = this.state;
        return (
            <div className="flex modeltouch" id="model">
                <div className={`modeldir dir_up${dir===1?" show":""}`}></div>
                <div className={`modeldir dir_right${dir===2?" show":""}`}></div>
                <div className={`modeldir dir_down${dir===3?" show":""}`}></div>
                <div className={`modeldir dir_left${dir===4?" show":""}`}></div>
            </div>
        )
    }
}

class ModelKey extends PureComponent {
    render() {
        const {fly} = this.props;
        return (
            <div className="flex">
                <div className="key_hd">
                    {
                        // <a className="remote_btn center">
                        //     <span>123</span>
                        // </a>
                    }
                    <div className="remote_volumn_con">
                        <a className="remote_volumn remote_volumn_add" onClick={()=>fly(24)}>+</a>
                        <a className="remote_volumn remote_volumn_mute center" onClick={()=>fly(164)}><span></span></a>
                        <a className="remote_volumn remote_volumn_minus" onClick={()=>fly(25)}>-</a>
                    </div>
                </div>
                <div className="flex key_wrap">
                    <div className="key_bd">
                        <a className="control_key key_left" onClick={()=>fly(21)}></a>
                        <a className="control_key key_up" onClick={()=>fly(19)}></a>
                        <a className="control_key key_bottom" onClick={()=>fly(20)}></a>
                        <a className="control_key key_right" onClick={()=>fly(22)}></a>
                        <a className="key_ok" onClick={()=>fly(23)}></a>
                    </div>
                </div>
            </div>
        )
    }
}

export default class extends PureComponent {

    state = {
        isModelKey: false
    }

    componentDidMount() {
        document.body.addEventListener('touchstart', function () {});  
    }

    switchModel = () => {
        this.setState({ isModelKey: !this.state.isModelKey })
    }

    fly = async (key) => {
        const tm = new Date().getTime();
        const {deviceId} = JSON.parse(localStorage.getItem("$loginInfo"));
        const data = await Fly({
            to:deviceId+"@coship-mes.com/ANDROID",
            type:'control',
            par:`{
                "Cmd":105,
                "Timestamp":${tm},
                "Type":0,
                "content":"{
                    \\"KeyCode\\":${key}
                }",
                "revicerPackageName":"" 
            }`
        })
    }

    render() {
        const { isModelKey } = this.state;
        const loginInfo = JSON.parse(localStorage.getItem("$loginInfo"));
        return (
            <AnimatePage>
                <Appbar title='手机遥控' />
                <div className="flex remote_bg">
                    <div className="remote_top">
                        <a className="remote_select">tv-{loginInfo.deviceId}</a>
                        <a className="remote_switch" onClick={this.switchModel} >{isModelKey ? '按键模式' : '触屏模式'}</a>
                    </div>
                    {
                        isModelKey ? <ModelKey fly={this.fly} /> : <ModelTouch fly={this.fly}  />
                    }
                    <div className="remote_bot center">
                        <a className="remote_btn center" onClick={()=>this.fly(82)}>
                            <i className="remote_ico remote_ico01"></i>
                            <span>菜单</span>
                        </a>
                        <a className="remote_btn center" onClick={()=>this.fly(3)}>
                            <i className="remote_ico remote_ico02"></i>
                            <span>首页</span>
                        </a>
                        <a className="remote_btn center"  onClick={()=>this.fly(4)}>
                            <i className="remote_ico remote_ico03"></i>
                            <span>返回</span>
                        </a>
                    </div>
                </div>
            </AnimatePage>
        );
    }
}
