import React, { PureComponent } from 'react';
import fetchData from '../../util/Fetch';
import Loading from '../../component/Loading';
import TabView from '../../component/TabView';
import { Link } from 'react-keeper';
//import ContentView from './ContentView';

class ChannelList extends PureComponent {

    state = {
        isRender:false,
        data:[]
    }

    getChannels = async (categoryId) => {
        let data = await fetchData('GetChannels', {
            par: {
                channelType: categoryId,
                containPrograms: 'Y',
            }
        });
        if(data.totalResults>0){
            this.setState({
                data:data.channel,
                isRender:true
            })
        }
        //console.log(data.channel)
    }

    componentDidMount() {
        const {categoryId} = this.props;
        this.getChannels(categoryId);
    }

    render(){
        const {isRender,data} = this.state;
        return (
            isRender?
            <ul className="channellist">{
                data.map((el,i)=>(
                    <Link type='li' to={'/livedetail/' + el.channelId} className="channelitem" key={i}>
                        <img src={window.Base+el.logo} alt="" />
                        <h2>{el.channelName}</h2>
                        <h3>{el.program?'正在播放 '+el.program[0].programName:'暂无节目单'}</h3>
                    </Link>
                ))
            }</ul>
            :
            <Loading/>
        )
    }
}

export default class extends PureComponent {
    state = {
        isRender: false,
        channelCategories: [],
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

    render() {
        const { isRender, channelCategories, index } = this.state;

        return (
            <div className="flex">
                <div className="header">直播</div>
                {
                    isRender ?
                        <div className="flex">
                            <div className="tabs">
                                {
                                    channelCategories.map((item, i) => (
                                        <a key={item.categoryId} href="javascript:void(0)" onClick={() => this.link(i)} className={"tab" + (index === i ? " active" : "")} ><span>{item.categoryName}</span></a>
                                    ))
                                }
                            </div>
                            {
                                channelCategories.map((item, i) => (
                                    <TabView cache key={item.categoryId} current={index===i}><ChannelList categoryId={item.categoryId} /></TabView>
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

