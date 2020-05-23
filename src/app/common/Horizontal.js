import React from "react";

const HORIZONTAL_ALIGN = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
};
const VERTICAL_ALIGN = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end'
};
export default function Horizontal({children, heightFull, horizontalAlign, verticalAlign, gap, style, ...props}) {
    const inlineStyle = {display: 'flex', height: heightFull ? '100%' : 'none'};
    if (horizontalAlign in HORIZONTAL_ALIGN) {
        inlineStyle.justifyContent = HORIZONTAL_ALIGN[horizontalAlign];
    }
    if (verticalAlign in VERTICAL_ALIGN) {
        inlineStyle.alignItems = VERTICAL_ALIGN[verticalAlign];
    }
    if (gap > 0) {
        children = children.map((child, index) => {
            if (index > 0) {
                const childStyle = child?.props?.style ?? {};
                return React.cloneElement(child, {key: index, style: {marginLeft: gap, ...childStyle}})
            }
            return React.cloneElement(child, {key: index});
        })
    }
    return <div style={{...inlineStyle, ...style}} {...props}>{children}</div>
}
