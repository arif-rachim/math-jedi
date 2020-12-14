import React from "react";
import ReactSvgPieChart from 'react-svg-piechart';
import Vertical from "../common/Vertical";


export default function ProgressPie({style, value}) {

    return <div style={{
        position: 'absolute',
        width: 100,
        height: 100,
        ...style
    }}>
        <ReactSvgPieChart strokeWidth={0} startAngle={270} data={[
            {value: value, color: '#404040'},
            {value: (100 - value), color: '#A6A6A6'}]}/>
        <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            width: 80,
            height: 80,
            backgroundColor: 'white',
            borderRadius: 100
        }}>
            <Vertical heightFull={true} style={{fontSize: 22}} verticalAlign={'center'} horizontalAlign={'center'}>
            </Vertical>
        </div>
    </div>
}
