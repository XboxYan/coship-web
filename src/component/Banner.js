import React, { PureComponent } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Pagination from './Pagination';
import Loading from './Loading';
import { Link } from 'react-keeper';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = {
  root: {
    position: 'relative',
    overflow:'hidden'
  },
  empty:{
    height:200,
    background:'#333'
  }
};
class Banner extends PureComponent {
  state = {
    index: 0,
  };

  handleChangeIndex = (index) => {
    this.setState({index});
  };

  render() {
    const {
      index,
    } = this.state;
    const {data} = this.props;
    const len = data.length;
    if(len===0){
      return <div className="flex center" style={styles.empty}><Loading/></div>
    }

    return (
      <div style={styles.root}>
        <AutoPlaySwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
          {
            data.map((el,i)=>(
              <div className="bannercon" key={i} ><Link type='img' to={'/moviedetail/'+el.assetId} src={window.Base+el.recommendImage.posterUrl} /></div>
            ))
          }
        </AutoPlaySwipeableViews>
        <Pagination
          dots={len}
          index={index}
        />
      </div>
    )
  }
}

export default Banner
