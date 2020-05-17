import React, {useCallback, useEffect, useState} from "react";
import classes from './Input.module.css';

export default function Input({style,label,value,onChange,autoCaps=false, ...props}) {
    const [localValue,setLocalValue] = useState(value);
    useEffect(()=> {
        setLocalValue(value);
    },[value]);

    const handleChange = useCallback((event) => {
        let value = event.target.value;
        value = autoCaps ? value.toUpperCase() : value;
        if(onChange){
            onChange({value,oldVal:localValue});
        }else{
            setLocalValue(value);
        }
    },[autoCaps, localValue, onChange]);
    return <label className={classes.root} style={style}>
        <div className={classes.label}>{label}</div>
        <input className={classes.input} {...props} value={localValue} onChange={handleChange}/>
    </label>

}

export function InputNumber({style,label,value,onChange, ...props}) {
    const [localValue,setLocalValue] = useState(value);
    useEffect(()=> {
        setLocalValue(value);
    },[value]);
    const handleChange = useCallback((event) => {
        let value = parseInt(event.target.value);
        if(onChange){
            onChange({value,oldVal:localValue});
        }else{
            setLocalValue(value);
        }
    },[localValue, onChange]);
    return <label className={classes.root} style={style}>
        <div className={classes.label}>{label}</div>
        <input className={classes.input} type={'number'} style={{textAlign: 'right'}} {...props} value={localValue} onChange={handleChange}/>
    </label>
}
