import React, { PureComponent } from 'react';
import { Control,CacheLink } from 'react-keeper';
import AnimatePage from '../../component/AnimatePage';
import Appbar from '../../component/Appbar';
import Loading from '../../component/Loading';
import fetchData from '../../util/Fetch';

export default class extends PureComponent {
    state = {
        isRender: false,
        moviedata: false,
        assetId:''
    }

    fetchDataMovieList = async (assetId) => {
        let data = await fetchData('GetFolderContents', {
            par: {
                assetId: assetId,
                includeSelectableItem: 'Y',
                maxItems: 1000
            }
        })
        this.setState({
            moviedata: data.selectableItemList,
            isRender: true
        });
    }

    componentDidMount() {
        let assetId = Control.path.split('/moviemore/')[1];
        this.fetchDataMovieList(assetId);
    }
    render() {
        const { isRender, moviedata } = this.state;
        return (
            <AnimatePage>
                <Appbar title='更多推荐' />
                {
                    isRender ?
                    <ul className="movielist">
                        {
                            moviedata.map((el, i) => (
                                <CacheLink className="movieitem" key={i} type='li' to={Control.path+'/moviedetail/' + el.assetId}>
                                    <div className="movieitemcon"><img src={window.Base+(el.imageList[0]?el.imageList[0].posterUrl:'')} alt="" /></div>
                                    <h3>{el.titleBrief}</h3>
                                </CacheLink>
                            ))
                        }
                    </ul>
                    :
                    <Loading />
                }
            </AnimatePage>
        );
    }
}
