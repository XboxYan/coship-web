import React, { PureComponent } from 'react';
import fetchData from '../../util/Fetch';
import Loading from '../../component/Loading';
import TabView from '../../component/TabView';
import { Link,Control } from 'react-keeper';
import ContentView from './ContentView';
import {notify} from 'react-notify-toast';
import PropTypes from 'prop-types';
//import MovieMore from './MovieMore';
//import Search from './Search';

export default class Movie extends PureComponent {
    state = {
        isRender: false,
        RootContents: [],
        index:0,
    }
    GetRootContents = async () => {
        let data = await fetchData('GetRootContents');
        if (data.childFolder.length > 0) {
            this.setState({
                RootContents: data.childFolder,
                isRender: true
            })
        }
    }
    componentDidMount() {
        this.GetRootContents();
    }

    componentWillUpdate() {

    }

    link = (i) => {
        const { index } = this.state;
        if (i !== index) {
            this.setState({index:i})
        }
    }

    goRemote = async () => {
        const {loginState} = this.context;
        if(loginState){
            const {deviceId} = JSON.parse(localStorage.getItem("$loginInfo"));
            if(deviceId){
                Control.go(Control.path+'/remote');
            }else{
                notify.show('请先绑定设备~',"error", 2000);
                Control.go(Control.path+'/devices');
            }  
        }else{
            notify.show('请先登录~',"error", 2000);
            Control.go(Control.path+'/login');
        }
    }

    render() {
        const { isRender, RootContents, index } = this.state;

        return (
            <div className="flex">
                <div className="header">节目信息</div>
                <div className="app-top">
                    <Link to={'/movie/search'} className="search-bar">搜索</Link>
                    <a onClick={this.goRemote} to={'/remote'} className="search-btn" />
                </div>
                {
                    isRender ?
                        <div className="flex">
                            <div className="tabs">
                                {
                                    RootContents.map((item, i) => (
                                        <a key={item.assetId} href="javascript:void(0)" onClick={() => this.link(i)} className={"tab" + (index === i ? " active" : "")} ><span>{item.displayName}</span></a>
                                    ))
                                }
                            </div>
                            {
                                RootContents.map((item, i) => (
                                    <TabView cache key={item.assetId} current={index===i}><ContentView assetId={item.assetId} /></TabView>
                                ))
                            }
                        </div>
                        :
                        <Loading />
                }
            </div>
        )
    }
}

Movie.contextTypes = {
    loginState: PropTypes.bool,
};

