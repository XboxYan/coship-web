import React, { PureComponent } from 'react';

const styles={
    loadtxt:{
        fontSize:14,
        color:'#959799'
    }
}

export default class extends PureComponent {
    render() {
        return (
            <div style={{height:'100%'}} className="flex center">
                <div className="ball-scale-multiple">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div style={styles.loadtxt}>正在加载...</div>
            </div>
        )
    }
}

