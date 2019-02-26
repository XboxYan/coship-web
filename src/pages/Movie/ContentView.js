import React, { PureComponent } from 'react';
import fetchData from '../../util/Fetch';
import { Link } from 'react-keeper';
import Banner from '../../component/Banner';

const styles = {
    section:{
        padding:"0 5px"
    },
}

class MovieSection extends PureComponent {

    state = {
        moviedata: [],
        totalResults:0
    }

    fetchDataMovieList = async (assetId) => {
        let data = await fetchData('GetFolderContents', {
            par: {
                assetId: assetId,
                includeSelectableItem: 'Y',
            }
        })
        this.setState({
            moviedata:data.selectableItemList,
            totalResults:data.totalResults
        });
    }

    componentDidMount() {
        let { assetId } = this.props;
        this.fetchDataMovieList(assetId);
    }

    render() {
        const { MovieSectionTitle,assetId } = this.props;
        const { moviedata,totalResults } = this.state;
        return (
            <div style={styles.section}>
                <h2 className="sectionhd">
                    {MovieSectionTitle}
                    {
                        totalResults>6&&<Link className="sectionmore" to={'/movie/moviemore/'+assetId}>更多</Link>
                    }
                </h2>
                <ul className="sectionbd">
                    {
                        moviedata.map((el, i) => (
                            <Link className="movieitem" key={i} type='li' to={'/moviedetail/'+el.assetId}>
                                <div className="movieitemcon"><img src={window.Base+el.imageList[0].posterUrl} alt="" /></div>
                                <h3>{el.titleBrief}</h3>
                            </Link>
                        ))
                    }
                </ul>

            </div>
        )
    }
}

export default class extends PureComponent {

    state = {
        bannerData: [],
        sectionData: []
    }

    fetchDataBanner = async (assetId) => {
        let data = await fetchData('GetAssociatedFolderContents', {
            par: {
                quickId: assetId
            }
        })
        if (data.totalResults > 0) {
            //console.log(data)
            this.setState({
                bannerData: data.selectableItem
            })
        }
    }

    fetchDataTagList = async (assetId) => {
        let data = await fetchData('GetRetrieveContent', {
            par: {
                //retrieve:'origin',
                folderAssetId: assetId
            }
        })

        if (data.totalResults > 0) {
            //console.log(data)
        }
    }

    fetchDataMovieSection = async (assetId) => {

        let data = await fetchData('GetFolderContents', {
            par: {
                assetId: assetId
            }
        })
        //console.log(data)
        this.setState({
            sectionData: data.childFolderList
        })
    }

    componentDidMount() {
        const { assetId } = this.props;
        this.fetchDataBanner(assetId);
        this.fetchDataTagList(assetId);
        this.fetchDataMovieSection(assetId);
    }

    render() {
        const { bannerData, sectionData } = this.state;
        return (
            <div className="flex">
                <Banner data={bannerData} />
                {
                    sectionData.map((el, i) => (
                        <MovieSection key={i} assetId={el.assetId} MovieSectionTitle={el.displayName} />
                    ))
                }
            </div>
        )
    }
}

