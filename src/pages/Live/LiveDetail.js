import React, { PureComponent } from 'react';
import fetchData from '../../util/Fetch';
import Fly from '../../util/Fly';
import Loading from '../../component/Loading';
import TabView from '../../component/TabView';
import AnimatePage from '../../component/AnimatePage';
import Appbar from '../../component/Appbar';
import { Control } from 'react-keeper';
import PropTypes from 'prop-types';
import {notify} from 'react-notify-toast';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
//import ReactPlayer from 'react-player';
//import ContentView from './ContentView';

class ChannelList extends PureComponent {

    state = {
        isRender:false,
        data:[],
        isEmpty:false,
        liveId:''
    }

    getPrograms = async (channelIds,startDateTime) => {
        let data = await fetchData('GetPrograms', {
            par: {
                channelIds,
                startDateTime
            }
        });
        this.setState({
            isRender:true
        })
        if(data.totalResults>0){
            this.setState({
                data:data.program.reverse(),
            })
            this.onReset(data.program);
        }else{
            this.setState({
                isEmpty:true,
            })
        }
    }

    componentDidUpdate(Props) {
        if(Props.current!==this.props.current&&this.props.current&&this.props.today===0){
            const {data} = this.state;
            this.onReset(data);
        }
    }

    onReset = (data) => {
        const {today,onSet,program} = this.props;
        if(today===0){
            let now = moment().format('YYYYMMDDHHmmss');
            
            let index = data.findIndex(el=>el.startDateTime<=now&&el.endDateTime>=now);
            let current = data[index];
            if(!current){
                return
            }
            const {liveId} = this.state;
            this.setState({liveId:current.programId})
            if(!program.programId){
                onSet(current,true);
                this.list.scrollTop = 54*index;
            }
            if(liveId===program.programId){
                onSet(current,true,true);
            }
        }
    }

    componentDidMount() {
        const {channelIds,startDateTime} = this.props;
        
        this.getPrograms(channelIds,startDateTime);
    }

    render(){
        const {isRender,isEmpty,data,liveId} = this.state;
        const {program:{programId},onSet,today} = this.props;
        if(isEmpty){
            return <div className="flex empty center">暂无节目单</div>
        }
        return (
            isRender?
            <ul ref={(node)=>{this.list=node;}} className="programlist">{
                data.map((el,i)=>(
                    <li onClick={()=>(el.programId===programId||(today===0&&el.programId>liveId)||today<0)?{}:onSet(el,el.programId===liveId)} className={"programitem"+(el.programId===programId?" active":"")} key={i}>
                        <span>{moment(el.startDateTime,'YYYYMMDDHHmmss').format('HH:mm')}</span>
                        <i>{el.programName}</i>
                        <a className={(today>0||el.programId<=liveId)?"":"noBorder"}>
                            {
                                (today>0||el.programId<liveId)&&'回看'||el.programId===liveId&&'直播'||'未开始'
                            }
                        </a>
                    </li>
                ))
            }</ul>
            :
            <Loading/>
        )
    }
}

const days = [-4, -3, -2, -1, 0, 1, 2];

export default class LiveDetail extends PureComponent {
    state = {
        isRender: false,
        palyURL:'',
        channelName:'',
        channelCategories: [],
        dayArr:[],
        today:0,
        program:{},
        isLive:true,
        isPause:false,
        index:0,
    }
    GetRootContents = async () => {
        let data = await fetchData('GetChannels',{
            par: {
                maxItems: 1
            }
        });
        this.setState({
            channelCategories: data.categorys.category,
            isRender: true
        })
    }
    componentDidMount() {
        let now = moment();
        let dayArr = days.map(day=>({
            date:moment(now).add(day, 'days').format('MM-DD'),
            week:day === 0 ? '今天' : moment(now).add(day, 'days').format('ddd'),
            time:moment(now).add(day, 'days').format('YYYYMMDD[000000]'),
        }))
        let index = days.findIndex(el=>el===0);
        this.setState({
            dayArr,
            index,
            today:index,
            isRender:true
        })
        //console.log(dayArr)
    }

    onPlay = (bool=true) => {
        this.setState({isPause:!bool});
        if(bool){
            this.video.play();   
        }else{
            this.video.pause();
        }
    }

    onSet = async (program,isLive,bool=false) => {
        this.setState({program,isLive});
        if(bool){
            return
        }
        const par = {
            resourceCode: program.channelId,
            fmt: '2',
        };
        //直播
        if(isLive){
            par.playType = 2;
        }else{
            const {startDateTime, endDateTime} = program;
            par.playType = 3;
            par.shifttime = moment(startDateTime,'YYYYMMDDHHmmss').valueOf() / 1000;
            par.shiftend = moment(endDateTime,'YYYYMMDDHHmmss').valueOf() / 1000;
        }
        let data = await fetchData('getPlayURL', {
            par: par
        });
        this.setState({palyURL:data.palyURL});
        this.onPlay(true);
        console.log(data);
    }

    componentWillUpdate() {

    }

    link = (i) => {
        const { index } = this.state;
        if (i !== index) {
            this.setState({index:i})
        }
    }

    fly = async () => {
        const {loginState} = this.context;
        if(loginState){
            const {deviceId} = JSON.parse(localStorage.getItem("$loginInfo"));
            if(deviceId){
                const tm = new Date().getTime();
                const { palyURL,isLive,program:{assetId,channelId,programId,channelName,programName,dayOfWeek,viewLevel,status,startDateTime,endDateTime} } = this.state;
                const data = await Fly({
                    to:deviceId+"@coship-mes.com/ANDROID",
                    type:'control',
                    par:`{
                        "Cmd":101,
                        "Timestamp":${tm},
                        "Type":0,
                        "content":"{
                            \\"playUrl\\":\\"${palyURL}\\",
                            \\"playType\\":\\"${isLive?2:3}\\",
                            \\"channel\\":{
                                \\"channelName\\":\\"${channelName}\\",
                                \\"channelId\\":\\"${channelId}\\",
                                \\"logo\\":\\"\\"
                            },
                            \\"tsId\\":\\"3\\",
                            \\"serId\\":\\"802\\",
                            \\"chName\\":\\"${channelName}\\",
                            \\"progName\\":\\"${programName}\\",
                            \\"program\\":{
                                \\"assetId\\":\\"${assetId}\\",
                                \\"channelId\\":\\"${channelId}\\",
                                \\"channelName\\":\\"${channelName}\\",
                                \\"dayOfWeek\\":\\"${dayOfWeek}\\",
                                \\"endDateTime\\":\\"${endDateTime}\\",
                                \\"programId\\":\\"${programId}\\",
                                \\"programName\\":\\"${programName}\\",
                                \\"startDateTime\\":\\"${startDateTime}\\",
                                \\"status\\":\\"${status}\\",
                                \\"viewLevel\\":\\"${viewLevel}\\"
                            }
                        }",
                        "revicerPackageName":"com.coship.linetv"
                    }`
                })
                if(data.includes('SUCCESS')){
                    //notify.show('飞入成功~',"success", 2000);
                    this.onPlay(false);
                    Control.go(Control.path+'/remote');
                }else{
                    notify.show('飞入失败，请检测设备是否在线~',"error", 2000);
                }              
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
        const { isRender,palyURL, dayArr, index, today, program, isPause } = this.state;
        let channelIds = Control.path.split('/livedetail/')[1];
        return (
            <AnimatePage>
                <Appbar title={program.channelName||'节目详情'} />
                <div className={`videocon${isPause?" isPause":""}`} onClick={this.onPlay}>
                    <video id="video" ref={(node)=>this.video=node} controls autoPlay src={palyURL} />
                </div>
                {
                    isRender?
                    <div className="tabs">
                    {
                        dayArr.map((item, i) => (
                            <a key={i} style={{height:53}} href="javascript:void(0)" onClick={() => this.link(i)} className={"tab" + (index === i ? " active" : "")} ><span style={{height:44,paddingTop:6,lineHeight:'20px'}}>{item.week}<br/><i>{item.date}</i></span></a>
                        ))
                    }
                    </div>
                    :
                    <Loading/>
                }
                {
                    isRender&&dayArr.map((item, i) => (
                        <TabView cache key={i} current={index===i}><ChannelList today={today-i} current={index===i} onSet={this.onSet} program={program} channelIds={channelIds} startDateTime={item.time} /></TabView>
                    ))
                }
                <div className="tv_btn" onClick={this.fly}>在电视上观看</div>
            </AnimatePage>
        )
    }
}

LiveDetail.contextTypes = {
    loginState: PropTypes.bool,
};

