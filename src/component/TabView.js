import React, { PureComponent } from 'react';

export default class extends PureComponent {
    state = {
        isRender:false
    }
    componentDidMount() {
        const { current } = this.props;
        if(current){
            this.setState({isRender:true});
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.current!==this.props.current){
            const { current,cache } = this.props;
            if(current||cache){
                this.setState({isRender:true});
            }else{    
                this.setState({isRender:false});
            }
        }
    }
    render() {
        const { current } = this.props;
        const {isRender} = this.state;
        if(isRender){
            return (
                <div className="flex" style={{display:current?'block':'none'}}>
                    {this.props.children}
                </div>
            )
        }
        return null
    }
}

