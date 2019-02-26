import React, { PureComponent } from 'react';
import { Control,Route,CacheLink } from 'react-keeper';
import AnimatePage from '../../component/AnimatePage';
import Appbar from '../../component/Appbar';
import Loading from '../../component/Loading';
import fetchData from '../../util/Fetch';

class SearchCon extends PureComponent {
    render(){
        const {hotwords,hiswords,onSubmit,onClear,onClearAll} = this.props;
        return (
            <div className="page flex">
                <h2 className="search_hd">大家都在搜</h2>
                <div className="search_hot">
                    {
                        hotwords.length>0?(
                            hotwords.map((el,i)=>(
                                <a onClick={()=>onSubmit(el.displayName)} key={i}>{el.displayName}</a>
                            ))
                        )
                        :
                        <Loading/>
                    }
                </div>
                <ul className="his_list">
                    {
                        hiswords.length>0?(
                            hiswords.map((el,i)=>(
                                <li onClick={()=>onSubmit(el)} key={i}>{el}<a onClick={(event)=>onClear(el,event)}></a></li>
                            ))
                        )
                        :
                        <div className="his_empty">暂无搜索历史</div>
                    }
                </ul>
                {
                    hiswords.length>0&&
                    <a onClick={onClearAll} className="his_clear_btn">清空历史记录</a>
                }
            </div>
        )
    }
}

class SearchList extends PureComponent {

    pageIndex = 1;

    pageSize = 10;

    keyword = '...';

    state = {
        data : [],
        keyword : '',
        isRender : false,
        totalResults : -1
    }

    getData = async () => {
		const startAt = this.pageSize * (this.pageIndex - 1) + 1;
		let _data = await fetchData('SearchAction', {
			par: {
				startAt,
				keyword:this.keyword,
				maxItems:this.pageSize
			}
        })
        const {data} = this.state;
        this.setState({
            data:[...data, ..._data.selectableItem],
            totalResults:_data.totalResults,
            isRender:true
        })
    }

    loadMore = () => {
		if (Number(this.state.totalResults) > this.state.data.length) {
			this.pageIndex = this.pageIndex + 1;
			this.getData();
		}
	}
    
    componentDidMount() {
        this.keyword =  decodeURI(Control.path.split('/movie/search/')[1]);
        this.setState({keyword:this.keyword})
        this.getData();
    }

    render(){
        const {data,isRender,totalResults,keyword} = this.state;
        return (
            <AnimatePage>
                <Appbar title={`" ${keyword} " 的搜索结果`} />
                {
                    isRender?
                    <ul className="movielist">
                        {
                            data.map((el, i) => (
                                <CacheLink className="movieitem" key={i} type='li' to={Control.path+'/moviedetail/' + el.assetId}>
                                    <div className="movieitemcon"><img src={window.Base+el.imageList[0].posterUrl} alt="" /></div>
                                    <h3>{el.titleBrief}</h3>
                                </CacheLink>
                            ))
                        }
                        {
                            Number(totalResults) > data.length&&
                            <li onClick={this.loadMore} className="his_clear_btn">加载更多</li>
                        }
                        {
                            Number(totalResults) === data.length && Number(totalResults) !== 0&&
                            <li className="searchbottom">--到底了--</li>
                        }
                    </ul>
                    :
                    <Loading/>
                }
                {
                    Number(totalResults) === 0&&<div className="searchempty">暂无数据</div>
                }
            </AnimatePage>
        )
    }
}

export default class extends PureComponent {

    state = {
        isRender: false,
        hotwords: [],
        hiswords:[],
        searchwords:'',
    }

    getHotKeyWorads = async () => {
        let data = await fetchData('GetSearchHotKeywords', {
            maxItems: 10
        })
        if (data.currentResults > 0) {
            //console.log(data)
            this.setState({
                hotwords: data.keywords
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        
        
    }

    onChange = (e) => {
        this.setState({searchwords: e.target.value});
    }

    onKeyup = (e) => {
        const {searchwords} = this.state;
        e.keyCode === 13 && this.onSubmit(searchwords);
    }

    onClear = (value,e) => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
        let {hiswords} = this.state;
        const index =  hiswords.findIndex((item)=>item===value);
        hiswords.splice(index,1);
        //console.log(hiswords)
        this.setState({hiswords:[...hiswords]});
        localStorage.setItem('$hitory',JSON.stringify(hiswords));
    }

    onClearAll = () => {
        this.setState({hiswords:[]})
        localStorage.setItem('$hitory',JSON.stringify([]));
    }

    onSubmit = (value) => {
        if(value){
            let {hiswords} = this.state;
            const index =  hiswords.findIndex((item)=>item===value);
            if(index>=0){
                hiswords.splice(index,1);
            }
            hiswords.push(value);
            this.setState({
                hiswords:[...hiswords],
                searchwords:''
            })
            localStorage.setItem('$hitory',JSON.stringify(hiswords));
            Control.go('/movie/search/'+encodeURI(value));
        }else{
            alert('搜索词不能为空~')
        }
    }

    componentDidMount() {
        this.input.focus();
        this.getHotKeyWorads();
        const $hitory = localStorage.getItem("$hitory");
        if($hitory){
            this.setState({
                hiswords:JSON.parse($hitory)
            })
        }
        //console.log($hitory)
        //let assetId = Control.path.split('/moviemore/')[1];
        //$assetId = assetId;
        //this.fetchDataMovieList(assetId);
    }
    render() {
        const { searchwords, hotwords, hiswords } = this.state;
        return (
            <AnimatePage>
                <Appbar title='搜索' />
                <div className="app-top" style={{paddingBottom:10,paddingLeft:10,backgroundImage:'none'}}>
                    <input ref={(node)=>{this.input=node}} className="search-bar" placeholder='输入搜索内容' value={searchwords} onChange={this.onChange} onKeyUp={this.onKeyup} />
                    <a className="search_submit" onClick={()=>this.onSubmit(searchwords)}>搜索</a>
                </div>
                <SearchCon hotwords={hotwords} onClear={this.onClear} onClearAll={this.onClearAll} hiswords={[...hiswords].reverse()} onSubmit={this.onSubmit} />
            </AnimatePage>
        );
    }
}

export {SearchList};
