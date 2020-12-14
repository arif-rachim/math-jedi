import React from "react";
import classes from './Button.module.css';
import {Link} from "react-router-dom";

export default function Button({children, onClick, ...props}) {
    return <button className={classes.button} onClick={onClick} {...props} >{children}</button>
}

export function ButtonLink({children, to,v, ...props}) {

    return <Link to={to} className={classes.button} v={v?.toString()} {...props} >{children}</Link>
}
