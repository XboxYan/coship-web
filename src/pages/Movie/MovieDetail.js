import React, { PureComponent } from 'react';
import { Control  } from 'react-keeper';
import AnimatePage from '../../component/AnimatePage';
import Appbar from '../../component/Appbar';
import Loading from '../../component/Loading';
import fetchData from '../../util/Fetch';
import Notifications from 'react-notify-toast';
//import ReactPlayer from 'react-player';

export default class extends PureComponent {
    state = {
        isRender:false,
        store:{},
        isPlay:false,
        playUrl:'',
        TVlist:[],
        index:0,
        movieRecom:[]
    }

    //播放串
    getPlayUrl = async (assetId) => {
        const data = await fetchData('getPlayURL', {
            headers: {'Content-Type': 'application/json'},
            par: {
                assetId: assetId
            }
        })
        if(data.ret === '0'){
            console.log(data.palyURL)
            this.setState({
                playUrl:data.palyURL,
                //playUrl:'http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
                playReady:true
            })
        } 
    }

    //详情
    getItemData = async (assetId) => {
        const data = await fetchData('GetItemData',{
            par:{
                titleAssetId: assetId
            }
        })
        if(!data.selectableItem){
            //alert('assetId有误')
            return
        }
        this.setState({
            store:data.selectableItem,
            isRender:true
        });
    }

    //推荐
    fetchRecom = async (assetId) => {
        let data = await fetchData('GetAssociatedFolderContents', {
            par: {
                quickId: assetId,
                targetLabel: 'A',
                associatedType: '1'
            }
        })
        if (data.totalResults > 0) {
            this.setState({
                movieRecom:data.selectableItem,
            });
            this.movielist.scrollLeft = 0;
        }
    }

    //剧集
    fetchTV = async (assetId) => {
        return new Promise(async (resolve) => {
            let data = await fetchData('GetFolderContents', {
                par: {
                    assetId: assetId,
                    maxItems: '',
                    includeSelectableItem: 'Y'
                }
            })
            resolve(data.selectableItemList)
        })
    }

    onPlay = async () => {
        let assetId = Control.path.split('/moviedetail/')[1];
        this.setState({
            isPlay:true,
        });
        const {store:{isPackage}} = this.state;
        if(isPackage==='1'){
            let data = await this.fetchTV(assetId);
            this.setState({TVlist:data});
            this.getPlayUrl(data[0].assetId);
        }else{
            this.getPlayUrl(assetId);
        }
    }

    setTvIndex = (index) => {
        const {TVlist} = this.state;
        this.setState({index});
        this.getPlayUrl(TVlist[index].assetId);
    }

    toMovie = (assetId) => {
        this.setState({
            isPlay:false,
        });
        Control.replace('/moviedetail/'+assetId);
        this.getItemData(assetId);
        this.fetchRecom(assetId);
    }

    componentDidMount() {
        //notify.show('Toasty!',"error", 2000, {background: 'rgba(0,0,0,.5)', text: "#fff"});
        let assetId = Control.path.split('/moviedetail/')[1];
        this.getItemData(assetId);
        this.fetchRecom(assetId);
    }
    render() {
        const {isRender,store,isPlay,movieRecom,TVlist,playUrl,index} = this.state;
        const isTV = store.isPackage === '1';
        return (
            <AnimatePage>
                <Notifications />
                <Appbar title={store.titleFull||'节目详情'} />
                {
                    isRender?
                    <div className="moviecon">
                        {
                            isPlay?
                            <div className="videocon">
                                <video controls autoPlay src={playUrl} />
                            </div>
                            :
                            <div className="movie_info">
                                <img className="movie_pic" src={window.Base+store.imageList[0].posterUrl} alt="" />
                                <div className="movie_txt">
                                    <h2>{store.titleFull}</h2>
                                    <h3>导演 : {store.director&&store.director.map((el)=>el.name)}</h3>
                                    <h3>主演 : {store.actor&&store.actor.map((el)=>el.name+' ')}</h3>
                                    <h3>类型 : {store.assetType}</h3>
                                    <h3>地区 : {store.originName}</h3>
                                </div>
                                <img className="movie_bg" src={window.Base+store.imageList[0].posterUrl} alt="" />
                            </div>
                        }
                        <div className="movie_detail">
                            {
                                isPlay?
                                <div className="movie_sub_txt">
                                    <h2>{store.titleFull}</h2>
                                    <h3>{store.assetType}</h3>
                                </div>
                                :
                                <div className="movie_action">
                                    <a onClick={this.onPlay} className="btn01">手机播放</a>
                                    <a className="btn02">电视播放</a>
                                </div>
                            }
                            <div className="moviesummary">{store.summarMedium}</div>
                            {
                                isTV&&isPlay&&<h3 className="subtitle">剧集</h3>
                            }
                            {
                                isTV&&isPlay&&
                                <div className="tvlist">
                                    {
                                        TVlist.map((el,i)=>(
                                            <button disabled={index===i} onClick={()=>this.setTvIndex(i)} className={index===i?"active":""} key={i}>{el.chapter}</button>
                                        ))
                                    }
                                </div>
                            }
                            <h3 className="subtitle">相关推荐</h3>
                            <ul className="movierelist" ref={(node)=>{this.movielist=node;}}>
                                {
                                    movieRecom.map((el,i)=>(
                                        <a onClick={()=>this.toMovie(el.assetId)} className="movieReitem" key={i}>
                                            <img src={window.Base+(el.imageList[0]?el.imageList[0].posterUrl:'')} alt="" />
                                            <span>{el.titleBrief}</span>
                                        </a>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    :
                    <Loading/>
                }
            </AnimatePage>
        );
    }
}
