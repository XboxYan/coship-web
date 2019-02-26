import React, { PureComponent } from 'react';
import { Route,Link,Control } from 'react-keeper';
import Movie from './Movie';
import Live from './Live';
import Me from './Me';
//import ReactPlayer from 'react-player';
// import MovieMore from './Movie/MovieMore';
// import Search from './Movie/Search';
//const Movie = () => <div>影视<Link to='/moviedetail/ASDFADF'>ASDFADF</Link></div>;
//const Live = () => <div>直播<CacheLink state={{ id: 123, name: 'John' }} to='/moviedetail/assa'>assa</CacheLink></div>;
//const Me = () => <ReactPlayer playing controls url={'http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'} />;

//const Me = () => <ReactPlayer playing controls url={'/vod/coship,TWSX1487310554478021111.m3u8'} />;

//const Me = () => <ReactPlayer playing controls url={'/live/coship,TWSX0331478574190067.m3u8'} />;

const NavItem = ({to,name,type}) => (
    <Link className="navcon center" isActive={()=>Control.path.indexOf(to) === 0 || (Control.path === '/'&&type==='nav01')} activeClassName='active' to={to}>
        <div className={"navitem "+type}></div>
        <span className="navtxt">{name}</span>
    </Link>
)

export default class Index extends PureComponent {
    
    render() {
        return (
            <div className="flex">
                <div className="page">
                    <Route cache='parent' component={ Movie } index path='/movie' />
                    <Route cache='parent' component={ Live } path='/live'/>
                    <Route cache='parent' component={ Me } path='/me'/>
                </div>
                <div className="nav">
                    <NavItem type="nav01" name="影视" to='/movie' />
                    <NavItem type="nav02" name="直播" to='/live' />
                    <NavItem type="nav03" name="我的" to='/me' />
                </div>
            </div>
        );
    }
}

