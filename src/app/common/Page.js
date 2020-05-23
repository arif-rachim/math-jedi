import React from "react";
import classes from './Page.module.css';

function Page({children, contentProps}) {
    const content = children.filter(c => !(c.type === Actions));
    const actions = children.filter(c => c.type === Actions);
    const hasActions = actions.length > 0;
    return <div className={classes.root}>
        <div className={classes.content} {...contentProps}>{content}</div>
        {hasActions && actions}
    </div>
}

const ACTIONS_ALIGN = {
    left: 'flex-start',
    right: 'flex-end',
    center: 'center'
};

function Actions({children, align = 'left'}) {
    return <div className={classes.actions} style={{justifyContent: ACTIONS_ALIGN[align]}}>
        {children}
    </div>
}

Page.Actions = Actions;

export default Page;
